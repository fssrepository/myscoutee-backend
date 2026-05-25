import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { DEMO_AFFINITY_GRAPH } from './data.js';

const canvas = document.querySelector('#graph-canvas');
const controlPanel = document.querySelector('.control-panel');
const memberCountEl = document.querySelector('#member-count');
const linkCountEl = document.querySelector('#link-count');
const componentCountEl = document.querySelector('#component-count');
const isolatedCountEl = document.querySelector('#isolated-count');
const memberPanel = document.querySelector('#member-panel');
const minWeightInput = document.querySelector('#min-weight');
const maxWeightInput = document.querySelector('#max-weight');
const weightRangeValue = document.querySelector('#weight-range-value');
const linkDepthInput = document.querySelector('#link-depth');
const linkDepthValue = document.querySelector('#link-depth-value');
const resetViewButton = document.querySelector('#reset-view');

const demoNodes = DEMO_AFFINITY_GRAPH.nodes.filter(node => node.id !== 'u-onboarding');
const nodeById = new Map(demoNodes.map(node => [node.id, {
  ...node,
  degree: 0,
  weightedDegree: 0,
  visibleDegree: 0,
  componentId: null,
  radius: 1.4,
  position: new THREE.Vector3()
}]));

const nodes = [...nodeById.values()];
const edges = DEMO_AFFINITY_GRAPH.edges
  .filter(edge => nodeById.has(edge.source) && nodeById.has(edge.target))
  .map(edge => ({
    ...edge,
    weight: clamp(Number(edge.weight ?? edge.affinityScore ?? 0), 0, 1)
  }));

const adjacency = new Map(nodes.map(node => [node.id, []]));
for (const edge of edges) {
  const source = nodeById.get(edge.source);
  const target = nodeById.get(edge.target);
  source.degree += 1;
  target.degree += 1;
  source.weightedDegree += edge.weight;
  target.weightedDegree += edge.weight;
  adjacency.get(edge.source).push({ edge, other: target });
  adjacency.get(edge.target).push({ edge, other: source });
}

const components = buildComponents(nodes, edges);
enrichComponents(components, edges);
placeNodes(nodes, edges, components);

const isolatedNodes = nodes.filter(node => node.degree === 0);
for (const node of nodes) {
  node.homePosition = node.position.clone();
  node.targetPosition = node.position.clone();
}

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  preserveDrawingBuffer: true,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111317);
scene.fog = new THREE.FogExp2(0x111317, 0.0095);

const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 500);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.minDistance = 24;
controls.maxDistance = 165;
controls.enablePan = false;
controls.screenSpacePanning = true;
controls.mouseButtons = {
  LEFT: null,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.ROTATE
};

const graphRoot = new THREE.Group();
const edgeGroup = new THREE.Group();
const selectedLinkGroup = new THREE.Group();
const forestGroup = new THREE.Group();
const nodeGroup = new THREE.Group();
graphRoot.add(edgeGroup, selectedLinkGroup, forestGroup, nodeGroup);
scene.add(graphRoot);

scene.add(new THREE.HemisphereLight(0xf8fbff, 0x182331, 1.55));
const keyLight = new THREE.DirectionalLight(0xffffff, 2.25);
keyLight.position.set(36, 48, 52);
scene.add(keyLight);
const sideLight = new THREE.DirectionalLight(0xffd7b1, 0.85);
sideLight.position.set(-56, 18, -36);
scene.add(sideLight);

const grid = new THREE.GridHelper(128, 16, 0x3b4149, 0x242930);
grid.position.y = -28;
grid.material.transparent = true;
grid.material.opacity = 0.32;
scene.add(grid);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clickTargets = [];
const forestClickTargets = [];
let selectedNode = null;
let activeComponentId = null;
let fullGraphExpanded = false;
let selectionReturnMode = null;
let hoverNode = null;
let hoverForest = null;
let edgeMesh = null;
let selectedLinkLines = null;
let pointerDown = null;
let visibleEdgeCount = 0;
let visibleEdges = [];
let visibleNodeIds = new Set(nodes.map(node => node.id));
let visibleNodeDepths = new Map(nodes.map(node => [node.id, 0]));
let nodeRefitTimer = null;
let nodeLayoutAnimation = null;
let cameraAnimation = null;
let selectionVisualAnimation = null;
const viewportPanOffset = { x: 0, y: 0 };

const selectionSprite = new THREE.Sprite(new THREE.SpriteMaterial({
  map: createRingTexture(),
  transparent: true,
  fog: false,
  depthTest: false,
  opacity: 0.92
}));
selectionSprite.visible = false;
selectionSprite.renderOrder = 30;
nodeGroup.add(selectionSprite);

createNodes();
createForests();
resize();
rebuildEdges();
refitVisibleNodes({ immediate: true });
fitCamera(false);
renderMemberPanel(null);
animate();

memberCountEl.textContent = String(nodes.length);
linkCountEl.textContent = String(edges.length);
componentCountEl.textContent = String(components.length);
isolatedCountEl.textContent = String(isolatedNodes.length);

minWeightInput.addEventListener('input', () => handleWeightRangeInput('min'));
maxWeightInput.addEventListener('input', () => handleWeightRangeInput('max'));
linkDepthInput.addEventListener('input', handleLinkDepthInput);

resetViewButton.addEventListener('click', () => {
  clearForest();
});
window.addEventListener('resize', resize);
window.addEventListener('keydown', handleKeyPan);
canvas.addEventListener('contextmenu', event => event.preventDefault());

canvas.addEventListener('pointerdown', event => {
  if (event.button !== 0) {
    return;
  }
  pointerDown = {
    x: event.clientX,
    y: event.clientY,
    lastX: event.clientX,
    lastY: event.clientY,
    pointerId: event.pointerId,
    dragged: false
  };
  canvas.setPointerCapture?.(event.pointerId);
});

canvas.addEventListener('pointermove', event => {
  if (pointerDown && (event.buttons & 1)) {
    const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
    const deltaX = event.clientX - pointerDown.lastX;
    const deltaY = event.clientY - pointerDown.lastY;
    pointerDown.lastX = event.clientX;
    pointerDown.lastY = event.clientY;

    if (pointerDown.dragged || moved > 4) {
      pointerDown.dragged = true;
      panViewportByScreenDelta(deltaX, deltaY);
      canvas.style.cursor = 'grabbing';
      return;
    }
  }

  const nextHoverNode = pickNode(event);
  const nextHoverForest = nextHoverNode ? null : pickForest(event);
  if (nextHoverNode !== hoverNode || nextHoverForest !== hoverForest) {
    hoverNode = nextHoverNode;
    hoverForest = nextHoverForest;
    canvas.style.cursor = nextHoverNode || nextHoverForest ? 'pointer' : 'grab';
  }
});

canvas.addEventListener('pointerup', event => {
  if (!pointerDown) {
    return;
  }
  const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  const dragged = pointerDown.dragged;
  canvas.releasePointerCapture?.(pointerDown.pointerId);
  pointerDown = null;
  if (dragged || moved > 6) {
    canvas.style.cursor = hoverNode || hoverForest ? 'pointer' : 'grab';
    publishPreviewState();
    return;
  }
  const node = pickNode(event);
  if (node) {
    selectNode(node.id, { focus: false });
    return;
  }

  const forest = pickForest(event);
  if (forest) {
    selectForest(forest.id);
  } else if (selectedNode) {
    clearSelection();
  }
});

function createNodes() {
  for (const node of nodes) {
    const component = components[node.componentId];
    const baseColor = colorForNode(node, component);
    node.radius = node.degree === 0 ? 1.75 : 1.5 + Math.min(0.45, Math.sqrt(node.degree) * 0.06);
    node.badgeScale = node.radius * 2;

    const badge = new THREE.Sprite(new THREE.SpriteMaterial({
      map: createInitialsTexture(node, baseColor),
      transparent: true,
      fog: false,
      depthTest: false,
      depthWrite: false
    }));
    badge.position.copy(node.position);
    badge.scale.setScalar(node.badgeScale);
    badge.renderOrder = node.degree === 0 ? 22 : 20;
    badge.userData.nodeId = node.id;
    node.badge = badge;
    clickTargets.push(badge);
    nodeGroup.add(badge);
  }
}

function createForests() {
  const forestPositions = forestOverviewPositions();
  for (const component of components) {
    const center = forestPositions.get(component.id) ?? new THREE.Vector3();
    component.forestPosition = center.clone();

    const badge = new THREE.Sprite(new THREE.SpriteMaterial({
      map: createForestTexture(component, colorForComponent(component)),
      transparent: true,
      fog: false,
      depthTest: false,
      depthWrite: false
    }));
    const scale = component.nodes.length === 1 ? 5.2 : 8.5 + Math.sqrt(component.nodes.length) * 1.35;
    component.forestScale = scale;
    badge.position.copy(center);
    badge.scale.setScalar(scale);
    badge.renderOrder = 24;
    badge.userData.componentId = component.id;
    component.forestBadge = badge;
    forestClickTargets.push(badge);
    forestGroup.add(badge);
  }
}

function forestOverviewPositions() {
  const sortedComponents = [...components].sort((a, b) => b.nodes.length - a.nodes.length || a.id - b.id);
  const positions = new Map();
  const mainScale = sortedComponents[0]?.nodes.length === 1
    ? 5.2
    : 8.5 + Math.sqrt(sortedComponents[0]?.nodes.length ?? 1) * 1.35;
  const satelliteCount = Math.max(0, sortedComponents.length - 1);
  const radius = Math.max(22, mainScale * 1.35 + 16);

  sortedComponents.forEach((component, index) => {
    if (index === 0) {
      positions.set(component.id, new THREE.Vector3(0, 0, 0));
      return;
    }

    const angle = -Math.PI / 2 + ((index - 1) / Math.max(1, satelliteCount)) * Math.PI * 2;
    positions.set(component.id, new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.82,
      Math.sin(angle) * radius * 0.22
    ));
  });

  return positions;
}

function rebuildEdges() {
  disposeObject(edgeMesh);
  edgeGroup.clear();

  const weightRange = currentWeightRange();
  updateWeightRangeUi(weightRange);
  updateLinkDepthUi();
  const thresholdEdges = edges.filter(edge => isEdgeInWeightRange(edge, weightRange));
  const visibleGraph = visibleGraphForCurrentView(thresholdEdges);
  visibleEdges = visibleGraph.edges;
  visibleNodeIds = visibleGraph.nodeIds;
  visibleNodeDepths = visibleGraph.nodeDepths;
  visibleEdgeCount = visibleEdges.length;
  for (const node of nodes) {
    node.visibleDegree = 0;
    node.visibleWeightSum = 0;
    node.visibleStrongest = 0;
  }
  for (const edge of visibleEdges) {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    source.visibleDegree += 1;
    target.visibleDegree += 1;
    source.visibleWeightSum += edge.weight;
    target.visibleWeightSum += edge.weight;
    source.visibleStrongest = Math.max(source.visibleStrongest, edge.weight);
    target.visibleStrongest = Math.max(target.visibleStrongest, edge.weight);
  }

  const isDeepSelection = selectedNode && currentLinkDepth() > 1;
  edgeMesh = createEdgeMesh(visibleEdges, {
    opacity: isDeepSelection ? 0.82 : 0.66,
    brighten: isDeepSelection ? 0.26 : 0.04
  });
  if (edgeMesh) {
    edgeMesh.renderOrder = isDeepSelection ? 4 : 2;
    edgeGroup.add(edgeMesh);
  }
  rebuildSelectedEdges();
  applyNodeState();

  publishPreviewState();
}

function visibleGraphForCurrentView(thresholdEdges) {
  if (selectedNode) {
    return visibleGraphForSelectedDepth(thresholdEdges);
  }
  if (fullGraphExpanded) {
    return visibleGraphForFullGraph(thresholdEdges);
  }
  if (activeComponentId !== null) {
    return visibleGraphForComponent(activeComponentId, thresholdEdges);
  }
  return {
    edges: [],
    nodeIds: new Set(),
    nodeDepths: new Map()
  };
}

function visibleGraphForFullGraph(thresholdEdges) {
  return {
    edges: thresholdEdges,
    nodeIds: new Set(nodes.map(node => node.id)),
    nodeDepths: new Map(nodes.map(node => [node.id, 0]))
  };
}

function visibleGraphForComponent(componentId, thresholdEdges) {
  const component = components[componentId];
  if (!component) {
    return {
      edges: [],
      nodeIds: new Set(),
      nodeDepths: new Map()
    };
  }

  const nodeIds = new Set(component.nodes.map(node => node.id));
  return {
    edges: thresholdEdges.filter(edge => nodeIds.has(edge.source) && nodeIds.has(edge.target)),
    nodeIds,
    nodeDepths: new Map(component.nodes.map(node => [node.id, 0]))
  };
}

function visibleGraphForSelectedDepth(thresholdEdges) {
  const maxDepth = currentLinkDepth();
  const nodeDepths = new Map([[selectedNode.id, 0]]);
  let frontier = new Set([selectedNode.id]);

  for (let depth = 1; depth <= maxDepth; depth += 1) {
    const nextFrontier = new Set();
    for (const edge of thresholdEdges) {
      const sourceInFrontier = frontier.has(edge.source);
      const targetInFrontier = frontier.has(edge.target);
      if (!sourceInFrontier && !targetInFrontier) {
        continue;
      }

      const nextId = sourceInFrontier ? edge.target : edge.source;
      if (!nodeDepths.has(nextId)) {
        nodeDepths.set(nextId, depth);
        nextFrontier.add(nextId);
      }
    }
    frontier = nextFrontier;
    if (!frontier.size) {
      break;
    }
  }

  const nodeIds = new Set(nodeDepths.keys());
  const graphEdges = maxDepth === 1
    ? thresholdEdges.filter(edge => edge.source === selectedNode.id || edge.target === selectedNode.id)
    : strongestLayerEdges(thresholdEdges, nodeDepths);

  return {
    edges: graphEdges,
    nodeIds,
    nodeDepths
  };
}

function strongestLayerEdges(thresholdEdges, nodeDepths) {
  const graphEdges = [];
  const edgeKeys = new Set();
  const parentEdgesByNode = new Map();
  const addEdge = edge => {
    const key = edge.source < edge.target ? `${edge.source}:${edge.target}` : `${edge.target}:${edge.source}`;
    if (!edgeKeys.has(key)) {
      edgeKeys.add(key);
      graphEdges.push(edge);
    }
  };

  for (const edge of thresholdEdges) {
    const sourceDepth = nodeDepths.get(edge.source);
    const targetDepth = nodeDepths.get(edge.target);
    if (sourceDepth === undefined || targetDepth === undefined || Math.abs(sourceDepth - targetDepth) !== 1) {
      continue;
    }

    const deeperNodeId = sourceDepth > targetDepth ? edge.source : edge.target;
    const deeperDepth = Math.max(sourceDepth, targetDepth);
    if (deeperDepth === 1) {
      addEdge(edge);
      continue;
    }

    if (!parentEdgesByNode.has(deeperNodeId)) {
      parentEdgesByNode.set(deeperNodeId, []);
    }
    parentEdgesByNode.get(deeperNodeId).push(edge);
  }

  for (const nodeEdges of parentEdgesByNode.values()) {
    nodeEdges
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .forEach(addEdge);
  }

  return graphEdges;
}

function createEdgeMesh(renderEdges, options = {}) {
  if (!renderEdges.length) {
    return null;
  }
  const brighten = Number(options.brighten ?? 0);
  const white = new THREE.Color(0xffffff);
  const positions = new Float32Array(renderEdges.length * 6);
  const colors = new Float32Array(renderEdges.length * 6);
  renderEdges.forEach((edge, index) => {
    const source = nodeById.get(edge.source).position;
    const target = nodeById.get(edge.target).position;
    const color = colorForWeight(edge.weight).lerp(white, brighten);
    const offset = index * 6;
    positions.set([source.x, source.y, source.z, target.x, target.y, target.z], offset);
    colors.set([color.r, color.g, color.b, color.r, color.g, color.b], offset);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: Number(options.opacity ?? 0.56),
    depthWrite: false,
    fog: false
  });
  const lines = new THREE.LineSegments(geometry, material);
  lines.userData.edges = renderEdges;
  return lines;
}

function rebuildSelectedEdges() {
  disposeObject(selectedLinkLines);
  selectedLinkGroup.clear();
  if (!selectedNode) {
    return;
  }

  const selectedLinks = visibleEdges.filter(edge => edge.source === selectedNode.id || edge.target === selectedNode.id);
  selectedLinkLines = createEdgeMesh(selectedLinks, {
    opacity: 0.98,
    brighten: 0.14
  });
  if (selectedLinkLines) {
    selectedLinkLines.renderOrder = 6;
    selectedLinkGroup.add(selectedLinkLines);
  }
}

function selectNode(nodeId, options = {}) {
  const node = nodeById.get(nodeId) ?? null;
  const startScale = node?.badge?.scale.x ?? node?.badgeScale ?? 1;
  selectionReturnMode = fullGraphExpanded ? 'graph' : activeComponentId !== null ? 'forest' : 'graph';
  selectedNode = node;
  fullGraphExpanded = false;
  if (selectedNode) {
    activeComponentId = selectedNode.componentId;
  }
  if (selectedNode && options.focus) {
    controls.target.copy(selectedNode.position);
  }
  rebuildEdges();
  startSelectionVisualAnimation(startScale);
  renderMemberPanel(selectedNode);
  scheduleNodeRefit(70);
  publishPreviewState();
}

function selectForest(componentId) {
  if (!components[componentId]) {
    return;
  }
  activeComponentId = componentId;
  selectedNode = null;
  selectionReturnMode = null;
  fullGraphExpanded = false;
  restoreHomeNodePositions();
  rebuildEdges();
  renderMemberPanel(null);
  fitCameraToVisible(true);
  publishPreviewState();
}

function clearSelection() {
  const previousNode = selectedNode;
  const startScale = previousNode?.badge?.scale.x ?? previousNode?.badgeScale ?? 1;
  const startRingScale = selectionSprite.scale.x;
  const startRingOpacity = selectionSprite.visible ? selectionSprite.material.opacity : 0;
  selectionVisualAnimation = null;
  selectedNode = null;
  const returnMode = selectionReturnMode;
  selectionReturnMode = null;

  if (returnMode === 'forest' && activeComponentId !== null) {
    fullGraphExpanded = false;
    rebuildEdges();
    startDeselectionVisualAnimation(previousNode, startScale, startRingScale, startRingOpacity);
    renderMemberPanel(null);
    refitVisibleNodes({ immediate: false });
    fitCameraToVisibleTargets(true);
    publishPreviewState();
    return;
  }

  activeComponentId = null;
  fullGraphExpanded = true;
  rebuildEdges();
  startDeselectionVisualAnimation(previousNode, startScale, startRingScale, startRingOpacity);
  renderMemberPanel(null);
  refitVisibleNodes({ immediate: false });
  fitCameraToVisibleTargets(true);
  publishPreviewState();
}

function showFullGraph() {
  stopSelectionVisualAnimation();
  selectedNode = null;
  activeComponentId = null;
  selectionReturnMode = null;
  fullGraphExpanded = true;
  rebuildEdges();
  renderMemberPanel(null);
  refitVisibleNodes({ immediate: false });
  fitCameraToVisibleTargets(true);
  publishPreviewState();
}

function restoreHomeNodePositions() {
  nodeLayoutAnimation = null;
  if (nodeRefitTimer) {
    clearTimeout(nodeRefitTimer);
    nodeRefitTimer = null;
  }
  for (const node of nodes) {
    node.position.copy(node.homePosition);
    node.targetPosition.copy(node.homePosition);
  }
  syncGraphObjects();
}

function clearForest() {
  stopSelectionVisualAnimation();
  selectedNode = null;
  activeComponentId = null;
  selectionReturnMode = null;
  fullGraphExpanded = false;
  rebuildEdges();
  renderMemberPanel(null);
  refitVisibleNodes({ immediate: false });
  fitCamera(true);
  publishPreviewState();
}

function applyNodeState() {
  const showForestOverview = isForestOverview();
  const visibleNodes = nodes.filter(node => visibleNodeIds.has(node.id));
  const maxVisibleWeight = Math.max(1, ...visibleNodes.map(node => node.visibleWeightSum ?? 0));
  const maxVisibleDegree = Math.max(1, ...visibleNodes.map(node => node.visibleDegree ?? 0));
  forestGroup.visible = showForestOverview;
  for (const component of components) {
    if (component.forestBadge) {
      component.forestBadge.visible = showForestOverview;
    }
  }

  for (const node of nodes) {
    const isVisible = visibleNodeIds.has(node.id);
    const isSelected = node === selectedNode;
    const visualWeight = (node.visibleWeightSum ?? 0) / maxVisibleWeight;
    const visualDegree = (node.visibleDegree ?? 0) / maxVisibleDegree;
    const visualScore = clamp((Math.sqrt(visualWeight) * 0.68) + (visualDegree * 0.32), 0, 1);
    const nodeDepth = visibleNodeDepths.get(node.id) ?? 0;
    const depthFade = selectedNode ? Math.max(0.68, 1 - nodeDepth * 0.1) : 1;
    const baseScale = selectedNode || activeComponentId !== null
      ? 0.82 + visualScore * 0.58
      : 1;
    node.badge.visible = !showForestOverview && isVisible;
    node.badge.material.opacity = isSelected ? 1 : clamp((0.62 + visualScore * 0.36) * depthFade, 0.56, 0.98);
    node.badge.scale.setScalar(node.badgeScale * (isSelected ? 1.46 : baseScale * depthFade));
    node.badge.renderOrder = isSelected ? 36 : 18 + Math.round(visualScore * 10) - nodeDepth;
  }
  if (selectedNode) {
    selectionSprite.visible = true;
    selectionSprite.position.copy(selectedNode.position);
    selectionSprite.scale.setScalar(selectedNode.badgeScale * 1.42);
  } else {
    selectionSprite.visible = false;
  }
}

function publishPreviewState() {
  window.affinityGraphPreview = {
    members: nodes.length,
    links: edges.length,
    visibleLinks: visibleEdgeCount,
    components: components.length,
    isolated: isolatedNodes.length,
    visibleNodes: visibleNodeIds.size,
    visibleNodeIds: Array.from(visibleNodeIds),
    selected: selectedNode?.id ?? null,
    selectedName: selectedNode?.name ?? null,
    selectedType: selectedNode ? 'node' : null,
    activeComponentId,
    fullGraphExpanded,
    viewMode: selectedNode ? 'member' : activeComponentId !== null ? 'forest' : fullGraphExpanded ? 'graph' : 'overview',
    weightRange: currentWeightRange(),
    linkDepth: currentLinkDepth(),
    visibleNodeDepths: Object.fromEntries(visibleNodeDepths),
    visibleForests: isForestOverview() ? components.length : 0,
    nodeIds: nodes.map(node => node.id),
    rendererReady: true,
    cameraAnimating: Boolean(cameraAnimation),
    cameraPosition: camera.position.toArray(),
    cameraTarget: controls.target.toArray(),
    cameraState() {
      return {
        animating: Boolean(cameraAnimation),
        position: camera.position.toArray(),
        target: controls.target.toArray()
      };
    },
    screenPositionForForest(id) {
      const component = components[id];
      if (!component?.forestPosition) {
        return null;
      }
      return screenPositionForWorldPosition(component.forestPosition);
    },
    screenPositionForNode(id) {
      const node = nodeById.get(id);
      if (!node) {
        return null;
      }
      return screenPositionForWorldPosition(node.position);
    }
  };
}

function screenPositionForWorldPosition(position) {
  const rect = canvas.getBoundingClientRect();
  const projected = position.clone().project(camera);
  return {
    x: rect.left + ((projected.x + 1) / 2) * rect.width,
    y: rect.top + ((1 - projected.y) / 2) * rect.height,
    z: projected.z
  };
}

function renderMemberPanel(node) {
  if (!node) {
    if (activeComponentId !== null) {
      renderForestPanel(components[activeComponentId]);
      return;
    }
    if (fullGraphExpanded) {
      memberPanel.innerHTML = `<p class="empty-state">${nodes.length} members visible · ${visibleEdgeCount} links in range · ${components.length} forests.</p>`;
      return;
    }
    memberPanel.innerHTML = `<p class="empty-state">${components.length} forests · ${nodes.length} demo members · ${isolatedNodes.length} isolated.</p>`;
    return;
  }

  const weightRange = currentWeightRange();
  const sortedNeighbors = adjacency.get(node.id)
    .map(({ edge, other }) => ({ edge, other }))
    .sort((a, b) => b.edge.weight - a.edge.weight);
  const filteredNeighbors = sortedNeighbors.filter(item => isEdgeInWeightRange(item.edge, weightRange));
  const topNeighbors = filteredNeighbors.slice(0, 5);
  const strongest = topNeighbors[0]?.edge.weight ?? 0;
  const visibleConnections = filteredNeighbors.length;
  const avatarColor = colorForNode(node, components[node.componentId]).getStyle();
  const neighborItems = topNeighbors.length
    ? topNeighbors.map(({ edge, other }) => `
      <li>
        <strong>${escapeHtml(other.name)}</strong>
        <span>${Math.round(edge.weight * 100)}%</span>
      </li>
    `).join('')
    : node.degree === 0
      ? '<li><strong>Disconnected in affinity seed</strong><span>0%</span></li>'
      : '<li><strong>No links in range</strong><span>0%</span></li>';

  memberPanel.innerHTML = `
    <p class="member-kicker">${node.degree === 0 ? 'Isolated member' : 'Selected member'}</p>
    <div class="member-heading">
      <div class="avatar" style="background:${avatarColor}">${escapeHtml(node.initials || '?')}</div>
      <div>
        <h2>${escapeHtml(node.name)}</h2>
        <p class="member-subtitle">${escapeHtml([node.city, node.age ? `${node.age}` : null, node.traitLabel].filter(Boolean).join(' · '))}</p>
      </div>
    </div>
    <p class="member-headline">${escapeHtml(node.headline || node.statusText || 'Demo profile')}</p>
    <dl class="detail-grid">
      <div>
        <dt>Total links</dt>
        <dd>${node.degree}</dd>
      </div>
      <div>
        <dt>Visible</dt>
        <dd>${visibleConnections}</dd>
      </div>
      <div>
        <dt>Strongest</dt>
        <dd>${Math.round(strongest * 100)}%</dd>
      </div>
    </dl>
    <ul class="neighbor-list">${neighborItems}</ul>
  `;
}

function renderForestPanel(component) {
  if (!component) {
    return;
  }

  const representative = component.representative;
  const forestColor = colorForComponent(component).getStyle();
  const topMembers = [...component.nodes]
    .sort((a, b) => b.degree - a.degree || b.weightedDegree - a.weightedDegree || a.name.localeCompare(b.name))
    .slice(0, 5);
  const memberItems = topMembers.map(member => `
    <li>
      <strong>${escapeHtml(member.name)}</strong>
      <span>${member.degree}</span>
    </li>
  `).join('');

  memberPanel.innerHTML = `
    <p class="member-kicker">${component.nodes.length === 1 ? 'Isolated forest' : 'Expanded forest'}</p>
    <div class="member-heading">
      <div class="avatar" style="background:${forestColor}">${escapeHtml(representative.initials || '?')}</div>
      <div>
        <h2>${escapeHtml(representative.name)}</h2>
        <p class="member-subtitle">${component.nodes.length} members · ${component.edges.length} links</p>
      </div>
    </div>
    <p class="member-headline">${escapeHtml(representative.headline || representative.statusText || 'Most connected member')}</p>
    <dl class="detail-grid">
      <div>
        <dt>Members</dt>
        <dd>${component.nodes.length}</dd>
      </div>
      <div>
        <dt>Visible</dt>
        <dd>${visibleNodeIds.size}</dd>
      </div>
      <div>
        <dt>Top links</dt>
        <dd>${representative.degree}</dd>
      </div>
    </dl>
    <ul class="neighbor-list">${memberItems}</ul>
  `;
}

function handleWeightRangeInput(changedHandle) {
  normalizeWeightRange(changedHandle);
  rebuildEdges();
  renderMemberPanel(selectedNode);
  scheduleNodeRefit(130);
}

function handleLinkDepthInput() {
  updateLinkDepthUi();
  rebuildEdges();
  renderMemberPanel(selectedNode);
  scheduleNodeRefit(120);
}

function handleKeyPan(event) {
  if (!event.key.startsWith('Arrow') || event.defaultPrevented || event.target?.closest?.('.control-panel')) {
    return;
  }

  const step = event.shiftKey ? 86 : 46;
  if (event.key === 'ArrowLeft') {
    panViewportByScreenDelta(-step, 0);
  } else if (event.key === 'ArrowRight') {
    panViewportByScreenDelta(step, 0);
  } else if (event.key === 'ArrowUp') {
    panViewportByScreenDelta(0, -step);
  } else if (event.key === 'ArrowDown') {
    panViewportByScreenDelta(0, step);
  } else {
    return;
  }

  event.preventDefault();
}

function normalizeWeightRange(changedHandle) {
  let minWeight = Number(minWeightInput.value);
  let maxWeight = Number(maxWeightInput.value);

  if (changedHandle === 'min' && minWeight > maxWeight) {
    maxWeight = minWeight;
    maxWeightInput.value = maxWeight.toFixed(2);
  }

  if (changedHandle === 'max' && maxWeight < minWeight) {
    minWeight = maxWeight;
    minWeightInput.value = minWeight.toFixed(2);
  }

  minWeightInput.style.zIndex = changedHandle === 'min' ? '4' : '2';
  maxWeightInput.style.zIndex = changedHandle === 'max' ? '4' : '3';
  updateWeightRangeUi({ min: minWeight, max: maxWeight });
}

function currentWeightRange() {
  return {
    min: Number(minWeightInput.value),
    max: Number(maxWeightInput.value)
  };
}

function updateWeightRangeUi(weightRange = currentWeightRange()) {
  const minWeight = clamp(weightRange.min, 0, 1);
  const maxWeight = clamp(weightRange.max, 0, 1);
  weightRangeValue.textContent = `${minWeight.toFixed(2)} - ${maxWeight.toFixed(2)}`;
  document.documentElement.style.setProperty('--range-min', String(minWeight * 100));
  document.documentElement.style.setProperty('--range-max', String(maxWeight * 100));
}

function isEdgeInWeightRange(edge, weightRange = currentWeightRange()) {
  return edge.weight >= weightRange.min && edge.weight <= weightRange.max;
}

function currentLinkDepth() {
  return Math.round(clamp(Number(linkDepthInput.value) || 1, 1, 3));
}

function updateLinkDepthUi() {
  const depth = currentLinkDepth();
  linkDepthInput.value = String(depth);
  linkDepthValue.textContent = depth === 1 ? 'Direct' : `${depth} hops`;
}

function isForestOverview() {
  return !selectedNode && activeComponentId === null && !fullGraphExpanded;
}

function pickNode(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const nodeIntersection = raycaster
    .intersectObjects(clickTargets, false)
    .find(intersection => {
      const nodeId = intersection.object.userData.nodeId;
      return intersection.object.visible && visibleNodeIds.has(nodeId);
    });
  if (nodeIntersection) {
    return nodeById.get(nodeIntersection.object.userData.nodeId) ?? null;
  }
  return null;
}

function pickForest(event) {
  if (!isForestOverview()) {
    return null;
  }

  const rect = canvas.getBoundingClientRect();
  const eventX = event.clientX - rect.left;
  const eventY = event.clientY - rect.top;
  let closestComponent = null;
  let closestDistance = Infinity;

  for (const component of components) {
    if (!component.forestBadge?.visible || !component.forestPosition) {
      continue;
    }

    const projected = component.forestPosition.clone().project(camera);
    if (projected.z < -1 || projected.z > 1) {
      continue;
    }

    const x = ((projected.x + 1) / 2) * rect.width;
    const y = ((1 - projected.y) / 2) * rect.height;
    const distance = Math.hypot(eventX - x, eventY - y);
    const worldDistance = camera.position.distanceTo(component.forestPosition);
    const fovRadians = THREE.MathUtils.degToRad(camera.fov);
    const pixelRadius = Math.max(
      18,
      (component.forestBadge.scale.x * rect.height) / (4 * Math.tan(fovRadians / 2) * worldDistance)
    );

    if (distance <= pixelRadius && distance < closestDistance) {
      closestComponent = component;
      closestDistance = distance;
    }
  }

  return closestComponent;
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(1, height);
  applyViewportOffset();
}

function fitCamera(animateTarget) {
  if (isForestOverview() && components.every(component => component.forestPosition)) {
    fitCameraToForestOverview(animateTarget);
    return;
  }
  fitCameraToVisible(animateTarget);
}

function fitCameraToVisible(animateTarget) {
  const points = nodes
    .filter(node => visibleNodeIds.has(node.id))
    .map(node => node.position);
  fitCameraToPoints(points.length ? points : nodes.map(node => node.position), animateTarget);
}

function fitCameraToVisibleTargets(animateTarget) {
  const points = nodes
    .filter(node => visibleNodeIds.has(node.id))
    .map(node => node.targetPosition ?? node.position);
  fitCameraToPoints(points.length ? points : nodes.map(node => node.position), animateTarget);
}

function fitCameraToForestOverview(animateTarget) {
  const center = components[0]?.forestPosition?.clone() ?? new THREE.Vector3();
  const radius = components.reduce((maxRadius, component) => {
    const position = component.forestPosition ?? center;
    const badgeRadius = (component.forestScale ?? 5) * 0.55;
    return Math.max(maxRadius, position.distanceTo(center) + badgeRadius);
  }, 8);
  fitCameraToCenterRadius(center, radius, animateTarget);
}

function fitCameraToPoints(points, animateTarget) {
  const box = new THREE.Box3().setFromPoints(points);
  const center = box.getCenter(new THREE.Vector3());
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  fitCameraToCenterRadius(center, sphere.radius, animateTarget);
}

function fitCameraToCenterRadius(center, radius, animateTarget) {
  const viewport = graphViewportMetrics();
  const safeWidthRatio = clamp(viewport.safeWidth / Math.max(1, viewport.fullWidth), 0.58, 1);
  const distance = Math.max(48, (radius * 1.68) / safeWidthRatio);
  const target = center.clone();
  const targetPosition = target.clone().add(new THREE.Vector3(distance * 0.24, distance * 0.34, distance));
  viewportPanOffset.x = 0;
  viewportPanOffset.y = 0;
  applyViewportOffset(viewport);
  if (animateTarget) {
    startCameraAnimation(targetPosition, target);
    return;
  }
  cameraAnimation = null;
  camera.position.copy(targetPosition);
  controls.target.copy(target);
  controls.update();
}

function applyViewportOffset(viewport = graphViewportMetrics()) {
  const width = Math.max(1, Math.round(viewport.fullWidth));
  const height = Math.max(1, Math.round(viewport.fullHeight));
  const offsetX = Math.round(viewport.centerOffsetPx + viewportPanOffset.x);
  const offsetY = Math.round(viewportPanOffset.y);

  if (Math.abs(offsetX) > 1 || Math.abs(offsetY) > 1) {
    camera.setViewOffset(width, height, offsetX, offsetY, width, height);
  } else {
    camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
}

function graphViewportMetrics() {
  const rect = canvas.getBoundingClientRect();
  let safeLeft = rect.left;
  let safeRight = rect.right;
  const panelRect = controlPanel?.getBoundingClientRect();
  const isSidePanel = panelRect
    && panelRect.left > rect.left + rect.width * 0.45
    && panelRect.width < rect.width * 0.5;

  if (isSidePanel) {
    safeRight = Math.max(rect.left + rect.width * 0.52, panelRect.left - 26);
  }

  const safeWidth = Math.max(1, safeRight - safeLeft);
  const fullCenterX = rect.left + rect.width / 2;
  const safeCenterX = safeLeft + safeWidth / 2;
  return {
    fullWidth: Math.max(1, rect.width),
    fullHeight: Math.max(1, rect.height),
    safeWidth,
    centerOffsetPx: fullCenterX - safeCenterX
  };
}

function panViewportByScreenDelta(deltaX, deltaY) {
  cameraAnimation = null;
  const viewport = graphViewportMetrics();
  viewportPanOffset.x = clamp(
    viewportPanOffset.x - deltaX,
    -viewport.fullWidth * 0.42,
    viewport.fullWidth * 0.42
  );
  viewportPanOffset.y = clamp(
    viewportPanOffset.y - deltaY,
    -viewport.fullHeight * 0.34,
    viewport.fullHeight * 0.34
  );
  applyViewportOffset(viewport);
  controls.update();
  publishPreviewState();
}

function animate() {
  requestAnimationFrame(animate);
  updateNodeLayoutAnimation();
  updateCameraAnimation();
  updateSelectionVisualAnimation();
  controls.update();
  renderer.render(scene, camera);
}

function startCameraAnimation(targetPosition, targetLookAt) {
  cameraAnimation = {
    startedAt: performance.now(),
    durationMs: 720,
    fromPosition: camera.position.clone(),
    toPosition: targetPosition.clone(),
    fromTarget: controls.target.clone(),
    toTarget: targetLookAt.clone()
  };
}

function updateCameraAnimation() {
  if (!cameraAnimation) {
    return;
  }
  const elapsed = performance.now() - cameraAnimation.startedAt;
  const progress = clamp(elapsed / cameraAnimation.durationMs, 0, 1);
  const eased = easeOutCubic(progress);
  camera.position.copy(cameraAnimation.fromPosition).lerp(cameraAnimation.toPosition, eased);
  controls.target.copy(cameraAnimation.fromTarget).lerp(cameraAnimation.toTarget, eased);
  if (progress >= 1) {
    cameraAnimation = null;
  }
}

function startSelectionVisualAnimation(startScale) {
  if (!selectedNode) {
    stopSelectionVisualAnimation();
    return;
  }

  const endScale = selectedNode.badgeScale * 1.46;
  selectionVisualAnimation = {
    type: 'select',
    node: selectedNode,
    startedAt: performance.now(),
    durationMs: 520,
    startScale,
    endScale,
    startRingScale: Math.max(startScale * 1.03, selectedNode.badgeScale * 0.72),
    endRingScale: selectedNode.badgeScale * 1.42,
    startRingOpacity: 0,
    endRingOpacity: 0.92
  };
  selectedNode.badge.scale.setScalar(startScale);
  selectionSprite.visible = true;
  selectionSprite.position.copy(selectedNode.position);
  selectionSprite.scale.setScalar(selectionVisualAnimation.startRingScale);
  selectionSprite.material.opacity = 0;
}

function startDeselectionVisualAnimation(node, startScale, startRingScale, startRingOpacity) {
  if (!node?.badge?.visible) {
    stopSelectionVisualAnimation();
    return;
  }

  const endScale = node.badge.scale.x;
  selectionVisualAnimation = {
    type: 'deselect',
    node,
    startedAt: performance.now(),
    durationMs: 460,
    startScale,
    endScale,
    startRingScale: Math.max(startRingScale, startScale * 0.98),
    endRingScale: Math.max(endScale * 1.05, node.badgeScale * 0.72),
    startRingOpacity: clamp(startRingOpacity, 0, 0.92),
    endRingOpacity: 0
  };
  node.badge.scale.setScalar(selectionVisualAnimation.startScale);
  selectionSprite.visible = true;
  selectionSprite.position.copy(node.position);
  selectionSprite.scale.setScalar(selectionVisualAnimation.startRingScale);
  selectionSprite.material.opacity = selectionVisualAnimation.startRingOpacity;
}

function stopSelectionVisualAnimation() {
  selectionVisualAnimation = null;
  selectionSprite.material.opacity = 0.92;
  if (!selectedNode) {
    selectionSprite.visible = false;
  }
}

function updateSelectionVisualAnimation() {
  if (!selectionVisualAnimation) {
    return;
  }
  const animatedNode = selectionVisualAnimation.node;
  if (!animatedNode?.badge || (selectionVisualAnimation.type === 'select' && animatedNode !== selectedNode)) {
    stopSelectionVisualAnimation();
    return;
  }

  const elapsed = performance.now() - selectionVisualAnimation.startedAt;
  const progress = clamp(elapsed / selectionVisualAnimation.durationMs, 0, 1);
  const eased = easeOutCubic(progress);
  const pulse = selectionVisualAnimation.type === 'select' ? Math.sin(progress * Math.PI) : 0;
  const badgeScale = THREE.MathUtils.lerp(
    selectionVisualAnimation.startScale,
    selectionVisualAnimation.endScale,
    eased
  ) + animatedNode.badgeScale * pulse * 0.055;
  const ringScale = THREE.MathUtils.lerp(
    selectionVisualAnimation.startRingScale,
    selectionVisualAnimation.endRingScale,
    eased
  ) + animatedNode.badgeScale * pulse * 0.04;
  const ringOpacity = THREE.MathUtils.lerp(
    selectionVisualAnimation.startRingOpacity,
    selectionVisualAnimation.endRingOpacity,
    eased
  );

  animatedNode.badge.scale.setScalar(badgeScale);
  selectionSprite.visible = true;
  selectionSprite.position.copy(animatedNode.position);
  selectionSprite.scale.setScalar(ringScale);
  selectionSprite.material.opacity = ringOpacity;

  if (progress >= 1) {
    animatedNode.badge.scale.setScalar(selectionVisualAnimation.endScale);
    selectionSprite.scale.setScalar(selectionVisualAnimation.endRingScale);
    selectionSprite.material.opacity = selectionVisualAnimation.endRingOpacity;
    selectionSprite.visible = selectionVisualAnimation.type === 'select';
    selectionVisualAnimation = null;
  }
}

function scheduleNodeRefit(delayMs = 100) {
  if (nodeRefitTimer) {
    clearTimeout(nodeRefitTimer);
  }
  nodeRefitTimer = setTimeout(() => {
    nodeRefitTimer = null;
    refitVisibleNodes({ immediate: false });
  }, delayMs);
}

function refitVisibleNodes({ immediate = false } = {}) {
  const targets = layoutTargetsForCurrentView();
  for (const node of nodes) {
    node.targetPosition = targets.get(node.id) ?? node.homePosition;
  }
  if (immediate) {
    nodeLayoutAnimation = null;
    for (const node of nodes) {
      node.position.copy(node.targetPosition);
    }
    syncGraphObjects();
    return;
  }
  nodeLayoutAnimation = {
    startedAt: performance.now(),
    durationMs: 620,
    from: new Map(nodes.map(node => [node.id, node.position.clone()]))
  };
}

function updateNodeLayoutAnimation() {
  if (!nodeLayoutAnimation) {
    return;
  }
  const elapsed = performance.now() - nodeLayoutAnimation.startedAt;
  const progress = clamp(elapsed / nodeLayoutAnimation.durationMs, 0, 1);
  const eased = easeOutCubic(progress);
  for (const node of nodes) {
    const start = nodeLayoutAnimation.from.get(node.id) ?? node.position;
    node.position.copy(start).lerp(node.targetPosition, eased);
  }
  syncGraphObjects();
  if (progress >= 1) {
    nodeLayoutAnimation = null;
  }
}

function syncGraphObjects() {
  for (const node of nodes) {
    node.badge?.position.copy(node.position);
  }
  if (selectedNode && selectionSprite.visible) {
    selectionSprite.position.copy(selectedNode.position);
  }
  updateEdgeLinePositions(edgeMesh);
  updateEdgeLinePositions(selectedLinkLines);
}

function updateEdgeLinePositions(lineObject) {
  if (!lineObject?.geometry?.attributes?.position || !Array.isArray(lineObject.userData?.edges)) {
    return;
  }
  const positions = lineObject.geometry.attributes.position.array;
  lineObject.userData.edges.forEach((edge, index) => {
    const source = nodeById.get(edge.source).position;
    const target = nodeById.get(edge.target).position;
    const offset = index * 6;
    positions.set([source.x, source.y, source.z, target.x, target.y, target.z], offset);
  });
  lineObject.geometry.attributes.position.needsUpdate = true;
  lineObject.geometry.computeBoundingSphere();
}

function layoutTargetsForCurrentView() {
  if (selectedNode) {
    return selectedNodeLayoutTargets();
  }
  if (fullGraphExpanded) {
    return forestLayoutTargets();
  }
  if (activeComponentId !== null) {
    return activeComponentLayoutTargets();
  }
  return new Map(nodes.map(node => [node.id, node.homePosition.clone()]));
}

function selectedNodeLayoutTargets() {
  const targets = new Map(nodes.map(node => [node.id, node.position.clone()]));
  const basis = viewBasis();
  const center = safeLayoutCenterForCamera();
  if (!visibleEdges.length) {
    targets.set(selectedNode.id, center.clone());
    return targets;
  }

  targets.set(selectedNode.id, center.clone());

  const strengthByNode = new Map();
  const visibleWeightByNode = new Map();
  for (const edge of visibleEdges) {
    strengthByNode.set(edge.source, Math.max(strengthByNode.get(edge.source) ?? 0, edge.weight));
    strengthByNode.set(edge.target, Math.max(strengthByNode.get(edge.target) ?? 0, edge.weight));
    visibleWeightByNode.set(edge.source, (visibleWeightByNode.get(edge.source) ?? 0) + edge.weight);
    visibleWeightByNode.set(edge.target, (visibleWeightByNode.get(edge.target) ?? 0) + edge.weight);
  }
  const maxVisibleWeight = Math.max(1, ...visibleWeightByNode.values());

  const depthGroups = new Map();
  for (const node of nodes) {
    if (node === selectedNode || !visibleNodeIds.has(node.id)) {
      continue;
    }
    const depth = clamp(Math.round(visibleNodeDepths.get(node.id) ?? 1), 1, currentLinkDepth());
    const strength = clamp(
      ((strengthByNode.get(node.id) ?? 0) * 0.58) + (((visibleWeightByNode.get(node.id) ?? 0) / maxVisibleWeight) * 0.42),
      0,
      1
    );
    if (!depthGroups.has(depth)) {
      depthGroups.set(depth, []);
    }
    depthGroups.get(depth).push({
      node,
      strength
    });
  }

  const placeOnShell = (item, index, count, radius) => {
    const point = sphereShellPoint(index, count, item.node.id);
    const target = center.clone()
      .addScaledVector(basis.right, point.x * radius)
      .addScaledVector(basis.up, point.y * radius)
      .addScaledVector(basis.forward, point.z * radius);
    targets.set(item.node.id, target);
  };
  const fallbackDirection = (node, index, count) => {
    const point = sphereShellPoint(index, count, `${node.id}:fallback`);
    return new THREE.Vector3()
      .addScaledVector(basis.right, point.x)
      .addScaledVector(basis.up, point.y)
      .addScaledVector(basis.forward, point.z)
      .normalize();
  };
  const previousHopDirection = (node, depth, fallbackIndex, fallbackCount) => {
    const direction = new THREE.Vector3();
    for (const edge of visibleEdges) {
      if (edge.source !== node.id && edge.target !== node.id) {
        continue;
      }
      const otherId = edge.source === node.id ? edge.target : edge.source;
      if ((visibleNodeDepths.get(otherId) ?? 0) !== depth - 1) {
        continue;
      }

      const otherTarget = targets.get(otherId);
      if (otherTarget) {
        direction.add(otherTarget.clone().normalize().multiplyScalar(edge.weight));
      }
    }

    if (direction.lengthSq() < 0.0001) {
      return fallbackDirection(node, fallbackIndex, fallbackCount);
    }
    return direction.normalize();
  };
  const spreadFromDirection = (direction, node, index, count) => {
    if (count <= 1) {
      return direction;
    }
    const shellDirection = fallbackDirection(node, index, count);
    const tangent = shellDirection.sub(direction.clone().multiplyScalar(shellDirection.dot(direction)));
    if (tangent.lengthSq() < 0.0001) {
      tangent.copy(basis.up).sub(direction.clone().multiplyScalar(basis.up.dot(direction)));
    }
    if (tangent.lengthSq() < 0.0001) {
      tangent.copy(basis.right).sub(direction.clone().multiplyScalar(basis.right.dot(direction)));
    }
    if (tangent.lengthSq() < 0.0001) {
      return direction;
    }
    const spread = 0.28 + Math.min(0.24, Math.sqrt(count) * 0.028);
    return direction.clone().add(tangent.normalize().multiplyScalar(spread)).normalize();
  };

  const innerItems = shellSortedItems(depthGroups.get(1) ?? []);
  innerItems.forEach((item, index) => {
    const radius = 14 + Math.sqrt(innerItems.length) * 0.78 + (1 - item.strength) * 2.2;
    placeOnShell(item, index, innerItems.length, radius);
  });

  for (let depth = 2; depth <= currentLinkDepth(); depth += 1) {
    const group = shellSortedItems(depthGroups.get(depth) ?? []);
    group.forEach((item, index) => {
      const parentDirection = previousHopDirection(item.node, depth, index, group.length);
      const direction = spreadFromDirection(parentDirection, item.node, index, group.length);
      const radius = 27 + Math.sqrt(group.length) * 1.04 + (depth - 2) * 12 + (1 - item.strength) * 2.4;
      targets.set(item.node.id, center.clone().addScaledVector(direction, radius));
    });
  }

  return targets;
}

function shellSortedItems(items) {
  return [...items].sort((a, b) => shellSortValue(a.node.id) - shellSortValue(b.node.id));
}

function safeLayoutCenterForCamera() {
  return controls.target.clone();
}

function activeComponentLayoutTargets() {
  return new Map(nodes.map(node => [node.id, node.homePosition.clone()]));
}

function forestLayoutTargets() {
  const layoutNodes = nodes.map(node => ({
    id: node.id,
    position: new THREE.Vector3(),
    weightedDegree: node.weightedDegree
  }));
  const layoutNodeById = new Map(layoutNodes.map(node => [node.id, node]));
  const layoutComponents = buildLayoutComponents(layoutNodes, visibleEdges);
  const sortedComponents = layoutComponents.sort((a, b) => b.length - a.length);
  const mainRadius = 13 + Math.sqrt(sortedComponents[0]?.length ?? 1) * 1.9;

  sortedComponents.forEach((componentNodes, index) => {
    let center = new THREE.Vector3();
    if (index > 0) {
      const angle = ((index - 1) / Math.max(1, sortedComponents.length - 1)) * Math.PI * 2;
      const radius = mainRadius + 12;
      center = new THREE.Vector3(
        Math.cos(angle) * radius,
        ((index % 2) - 0.5) * 10,
        Math.sin(angle) * radius
      );
    }
    if (componentNodes.length === 1) {
      componentNodes[0].position.copy(center);
      return;
    }
    const componentIds = new Set(componentNodes.map(node => node.id));
    const componentEdges = visibleEdges.filter(edge => componentIds.has(edge.source) && componentIds.has(edge.target));
    runForceLayout(componentNodes, componentEdges, center);
  });

  const targets = new Map();
  for (const node of nodes) {
    targets.set(node.id, layoutNodeById.get(node.id)?.position.clone() ?? node.homePosition.clone());
  }
  return targets;
}

function buildLayoutComponents(layoutNodes, layoutEdges) {
  const parent = new Map(layoutNodes.map(node => [node.id, node.id]));
  const find = id => {
    const parentId = parent.get(id);
    if (parentId === id) {
      return id;
    }
    const root = find(parentId);
    parent.set(id, root);
    return root;
  };
  const union = (a, b) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) {
      parent.set(rootB, rootA);
    }
  };
  for (const edge of layoutEdges) {
    union(edge.source, edge.target);
  }
  const groups = new Map();
  for (const node of layoutNodes) {
    const root = find(node.id);
    if (!groups.has(root)) {
      groups.set(root, []);
    }
    groups.get(root).push(node);
  }
  return [...groups.values()];
}

function viewBasis() {
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();
  return { right, up, forward };
}

function placeNodes(allNodes, allEdges, allComponents) {
  const sortedComponents = [...allComponents].sort((a, b) => b.nodes.length - a.nodes.length);
  const componentCenterById = new Map();
  const mainRadius = 14 + Math.sqrt(sortedComponents[0]?.nodes.length ?? 1) * 2;
  sortedComponents.forEach((component, index) => {
    if (index === 0) {
      componentCenterById.set(component.id, new THREE.Vector3(0, 0, 0));
      return;
    }
    const angle = ((index - 1) / Math.max(1, sortedComponents.length - 1)) * Math.PI * 2;
    const radius = mainRadius + 13;
    componentCenterById.set(component.id, new THREE.Vector3(
      Math.cos(angle) * radius,
      ((index % 2) - 0.5) * 16,
      Math.sin(angle) * radius
    ));
  });

  const edgeByComponent = new Map(allComponents.map(component => [component.id, []]));
  for (const edge of allEdges) {
    const componentId = nodeById.get(edge.source)?.componentId;
    if (componentId !== undefined) {
      edgeByComponent.get(componentId)?.push(edge);
    }
  }

  for (const component of allComponents) {
    const center = componentCenterById.get(component.id) ?? new THREE.Vector3();
    if (component.nodes.length === 1) {
      component.nodes[0].position.copy(center);
      continue;
    }
    runForceLayout(component.nodes, edgeByComponent.get(component.id) ?? [], center);
  }
}

function runForceLayout(componentNodes, componentEdges, center) {
  const positions = new Map();
  const velocities = new Map();
  const count = componentNodes.length;
  const initialRadius = 7 + Math.sqrt(count) * 2.1;
  componentNodes.forEach((node, index) => {
    const point = fibonacciPoint(index, count).multiplyScalar(initialRadius);
    const jitter = seededVector(node.id).multiplyScalar(2.8);
    positions.set(node.id, point.add(jitter));
    velocities.set(node.id, new THREE.Vector3());
  });

  const layoutEdges = componentEdges
    .filter(edge => edge.weight >= 0.18)
    .sort((a, b) => b.weight - a.weight);

  for (let step = 0; step < 460; step += 1) {
    const cooling = 1 - step / 460;
    for (let i = 0; i < count; i += 1) {
      const a = componentNodes[i];
      const posA = positions.get(a.id);
      const velA = velocities.get(a.id);
      for (let j = i + 1; j < count; j += 1) {
        const b = componentNodes[j];
        const posB = positions.get(b.id);
        const delta = posA.clone().sub(posB);
        const distanceSq = Math.max(7, delta.lengthSq());
        const force = Math.min(0.46, 58 / distanceSq) * cooling;
        delta.normalize().multiplyScalar(force);
        velA.add(delta);
        velocities.get(b.id).sub(delta);
      }
    }

    for (const edge of layoutEdges) {
      const posA = positions.get(edge.source);
      const posB = positions.get(edge.target);
      if (!posA || !posB) {
        continue;
      }
      const delta = posB.clone().sub(posA);
      const distance = Math.max(0.01, delta.length());
      const desired = 6 + (1 - edge.weight) * 14;
      const force = (distance - desired) * (0.0032 + edge.weight * 0.009);
      delta.normalize().multiplyScalar(force);
      velocities.get(edge.source).add(delta);
      velocities.get(edge.target).sub(delta);
    }

    for (const node of componentNodes) {
      const position = positions.get(node.id);
      const velocity = velocities.get(node.id);
      velocity.add(position.clone().multiplyScalar(-0.006));
      position.add(velocity.multiplyScalar(0.82));
      velocity.multiplyScalar(0.64);
    }
  }

  for (const node of componentNodes) {
    node.position.copy(positions.get(node.id).add(center));
  }
}

function buildComponents(allNodes, allEdges) {
  const parent = new Map(allNodes.map(node => [node.id, node.id]));
  const find = id => {
    const parentId = parent.get(id);
    if (parentId === id) {
      return id;
    }
    const root = find(parentId);
    parent.set(id, root);
    return root;
  };
  const union = (a, b) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) {
      parent.set(rootB, rootA);
    }
  };
  for (const edge of allEdges) {
    union(edge.source, edge.target);
  }

  const groups = new Map();
  for (const node of allNodes) {
    const root = find(node.id);
    if (!groups.has(root)) {
      groups.set(root, []);
    }
    groups.get(root).push(node);
  }

  return [...groups.values()]
    .sort((a, b) => b.length - a.length)
    .map((componentNodes, index) => {
      for (const node of componentNodes) {
        node.componentId = index;
      }
      return { id: index, nodes: componentNodes };
    });
}

function enrichComponents(allComponents, allEdges) {
  const edgesByComponent = new Map(allComponents.map(component => [component.id, []]));
  for (const edge of allEdges) {
    const componentId = nodeById.get(edge.source)?.componentId;
    edgesByComponent.get(componentId)?.push(edge);
  }

  for (const component of allComponents) {
    component.edges = edgesByComponent.get(component.id) ?? [];
    component.representative = [...component.nodes]
      .sort((a, b) => b.degree - a.degree || b.weightedDegree - a.weightedDegree || a.name.localeCompare(b.name))[0];
  }
}

function colorForWeight(weight) {
  const stops = [
    [0, new THREE.Color(0xb9e6ff)],
    [0.36, new THREE.Color(0x68b7ff)],
    [0.62, new THREE.Color(0xefb655)],
    [0.82, new THREE.Color(0xff725d)],
    [1, new THREE.Color(0xff2744)]
  ];
  for (let index = 0; index < stops.length - 1; index += 1) {
    const [leftStop, leftColor] = stops[index];
    const [rightStop, rightColor] = stops[index + 1];
    if (weight <= rightStop) {
      const t = (weight - leftStop) / (rightStop - leftStop);
      return leftColor.clone().lerp(rightColor, clamp(t, 0, 1));
    }
  }
  return stops[stops.length - 1][1].clone();
}

function colorForComponent(component) {
  if (!component?.representative) {
    return colorForGender('unknown');
  }
  return colorForNode(component.representative);
}

function colorForNode(node) {
  const color = colorForGender(genderForNode(node));
  const lift = node.degree === 0 ? 0.1 : Math.min(0.08, node.weightedDegree / 260);
  return color.lerp(new THREE.Color(0xffffff), lift);
}

function genderForNode(node) {
  const image = String(node?.image ?? '').toLowerCase();
  if (image.includes('/women/')) {
    return 'woman';
  }
  if (image.includes('/men/')) {
    return 'man';
  }
  return 'unknown';
}

function colorForGender(gender) {
  if (gender === 'woman') {
    return new THREE.Color(0xff4f6f);
  }
  if (gender === 'man') {
    return new THREE.Color(0x4aa8ff);
  }
  return new THREE.Color(0xffd83d);
}

function createInitialsTexture(node, fillColor) {
  const canvasEl = document.createElement('canvas');
  canvasEl.width = 256;
  canvasEl.height = 256;
  const ctx = canvasEl.getContext('2d');
  ctx.clearRect(0, 0, 256, 256);
  ctx.beginPath();
  ctx.arc(128, 128, 112, 0, Math.PI * 2);
  ctx.fillStyle = fillColor.getStyle();
  ctx.fill();
  ctx.lineWidth = node.degree === 0 ? 14 : 10;
  ctx.strokeStyle = node.degree === 0 ? '#fff3b5' : '#ffffff';
  ctx.stroke();
  ctx.fillStyle = '#111317';
  ctx.font = '900 70px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((node.initials || '?').slice(0, 3), 128, 132);
  const texture = new THREE.CanvasTexture(canvasEl);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createForestTexture(component, fillColor) {
  const representative = component.representative;
  const glowColor = fillColor.clone().lerp(new THREE.Color(0xffffff), 0.2).getStyle();
  const canvasEl = document.createElement('canvas');
  canvasEl.width = 256;
  canvasEl.height = 256;
  const ctx = canvasEl.getContext('2d');
  ctx.clearRect(0, 0, 256, 256);
  ctx.beginPath();
  ctx.arc(128, 128, 118, 0, Math.PI * 2);
  ctx.fillStyle = glowColor;
  ctx.globalAlpha = 0.22;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(128, 128, 108, 0, Math.PI * 2);
  ctx.fillStyle = fillColor.getStyle();
  ctx.fill();
  ctx.lineWidth = component.nodes.length === 1 ? 12 : 10;
  ctx.strokeStyle = component.nodes.length === 1 ? '#fff4a8' : '#e9fffb';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(128, 128, 92, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
  ctx.stroke();
  ctx.fillStyle = '#111317';
  ctx.font = '900 62px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((representative.initials || '?').slice(0, 3), 128, 108);
  ctx.font = '850 34px system-ui, sans-serif';
  ctx.fillText(String(component.nodes.length), 128, 168);
  const texture = new THREE.CanvasTexture(canvasEl);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createRingTexture() {
  const canvasEl = document.createElement('canvas');
  canvasEl.width = 256;
  canvasEl.height = 256;
  const ctx = canvasEl.getContext('2d');
  ctx.clearRect(0, 0, 256, 256);
  ctx.beginPath();
  ctx.arc(128, 128, 106, 0, Math.PI * 2);
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(128, 128, 84, 0, Math.PI * 2);
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#ff374d';
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvasEl);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function fibonacciPoint(index, count) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = count <= 1 ? 0 : 1 - (index / (count - 1)) * 2;
  const radius = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = golden * index;
  return new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
}

function sphereShellPoint(index, count, nodeId) {
  const base = fibonacciPoint(index, count);
  const jitter = seededVector(`${nodeId}:shell`).multiplyScalar(count <= 2 ? 0.05 : 0.12);
  base.add(jitter);
  if (base.lengthSq() < 0.0001) {
    base.set(1, 0, -0.25);
  }
  return base.normalize();
}

function shellSortValue(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededVector(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const a = ((hash >>> 0) % 997) / 997;
  const b = (((hash >>> 8) % 991) / 991) * Math.PI * 2;
  return new THREE.Vector3(
    Math.cos(b) * Math.sin(a * Math.PI),
    Math.cos(a * Math.PI),
    Math.sin(b) * Math.sin(a * Math.PI)
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function escapeHtml(value) {
  return `${value ?? ''}`
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function disposeObject(object) {
  if (!object) {
    return;
  }
  const geometries = new Set();
  const materials = new Set();
  object.traverse?.(child => {
    if (child.geometry) {
      geometries.add(child.geometry);
    }
    if (Array.isArray(child.material)) {
      child.material.forEach(material => materials.add(material));
    } else if (child.material) {
      materials.add(child.material);
    }
  });
  if (object.geometry) {
    geometries.add(object.geometry);
  }
  if (Array.isArray(object.material)) {
    object.material.forEach(material => materials.add(material));
  } else if (object.material) {
    materials.add(object.material);
  }
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => material.dispose());
}
