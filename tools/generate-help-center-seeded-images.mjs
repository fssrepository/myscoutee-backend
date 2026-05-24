#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const frontendRoot = join(repoRoot, 'frontend', 'src', 'assets', 'help-center', 'explanations');
const serverRoot = join(repoRoot, 'server', 'projects', 'profile', 'src', 'main', 'resources', 'mongo-seed', 'profile', 'help-center-media');

const contexts = {
  'home-game': ['affinity', 'affinity-network', 'profile', 'filters', 'history'],
  'activities-rates': ['activity-rate-filter', 'activity-header-controls', 'activity-score-badge', 'activity-fullscreen'],
  chats: ['activity-chat-list', 'activity-chat-card', 'activity-chat-channels', 'activity-chat-message-window', 'activity-chat-tools'],
  contacts: ['contacts-list', 'contacts-card', 'contacts-private-methods'],
  events: ['activity-event-entry', 'activity-event-card', 'activity-event-actions', 'activity-event-join', 'activity-event-hosting'],
  assets: ['assets-entry', 'assets-card', 'assets-editor', 'assets-requests', 'assets-scope'],
  'assets-car': ['assets-entry', 'assets-card', 'assets-editor', 'assets-requests', 'assets-scope'],
  'assets-accommodation': ['assets-entry', 'assets-card', 'assets-editor', 'assets-requests', 'assets-scope'],
  'assets-supplies': ['assets-entry', 'assets-card', 'assets-editor', 'assets-requests', 'assets-scope'],
  'assets-tickets': ['assets-tickets', 'assets-ticket-card', 'assets-ticket-scanner'],
  'event-editor': [
    'event-editor-main',
    'event-editor-switches',
    'event-editor-schedule',
    'event-editor-subevents',
    'event-editor-members',
    'event-editor-assets'
  ]
};

const labels = {
  en: {
    affinity: 'Affinity slider',
    'affinity-network': 'Affinity and group chat',
    profile: 'Profile and photos',
    filters: 'Filters and modes',
    history: 'History',
    'activity-rate-filter': 'Rating filter menu',
    'activity-header-controls': 'Order and view',
    'activity-score-badge': 'Card rating',
    'activity-fullscreen': 'Fullscreen rating',
    'activity-chat-list': 'Chat list filters',
    'activity-chat-card': 'One chat row',
    'activity-chat-channels': 'Channel types',
    'activity-chat-message-window': 'Message window',
    'activity-chat-tools': 'Chat tools',
    'contacts-list': 'Contacts list',
    'contacts-card': 'One contact card',
    'contacts-private-methods': 'Private contact methods',
    'assets-entry': 'Asset type menu',
    'assets-card': 'One asset card',
    'assets-editor': 'Asset editor',
    'assets-requests': 'Requests and helpers',
    'assets-scope': 'Discovery and assignment',
    'assets-tickets': 'Tickets',
    'assets-ticket-card': 'Ticket card',
    'assets-ticket-scanner': 'Ticket scanner',
    'event-editor-main': 'Main event form',
    'event-editor-switches': 'Visibility and join rules',
    'event-editor-schedule': 'Time, price, rules',
    'event-editor-subevents': 'Sub events and tournaments',
    'event-editor-members': 'Members and roles',
    'event-editor-assets': 'Assigned resources',
    'activity-event-entry': 'Event list controls',
    'activity-event-card': 'One event card',
    'activity-event-actions': 'Event card actions',
    'activity-event-join': 'Joining flow',
    'activity-event-hosting': 'Hosting options'
  },
  hu: {
    affinity: 'Szimpátia sáv',
    'affinity-network': 'Szimpátia és csoportchat',
    profile: 'Profil és képek',
    filters: 'Szűrők és módok',
    history: 'Előzmények',
    'activity-rate-filter': 'Értékelési szűrő',
    'activity-header-controls': 'Sorrend és nézet',
    'activity-score-badge': 'Kártya pontozása',
    'activity-fullscreen': 'Teljes képernyős pontozás',
    'activity-chat-list': 'Chatlista szűrők',
    'activity-chat-card': 'Egy chat sor',
    'activity-chat-channels': 'Csatornatípusok',
    'activity-chat-message-window': 'Üzenetablak',
    'activity-chat-tools': 'Chat eszközök',
    'contacts-list': 'Kapcsolatlista',
    'contacts-card': 'Egy kapcsolatkártya',
    'contacts-private-methods': 'Privátabb elérési módok',
    'assets-entry': 'Eszköztípus menü',
    'assets-card': 'Egy eszközkártya',
    'assets-editor': 'Eszközszerkesztő',
    'assets-requests': 'Kérések és segítők',
    'assets-scope': 'Felfedezés és hozzárendelés',
    'assets-tickets': 'Jegyek',
    'assets-ticket-card': 'Jegykártya',
    'assets-ticket-scanner': 'Jegyszkenner',
    'event-editor-main': 'Fő esemény űrlap',
    'event-editor-switches': 'Láthatóság és csatlakozás',
    'event-editor-schedule': 'Időpont, ár, szabályok',
    'event-editor-subevents': 'Alesemények és bajnokság',
    'event-editor-members': 'Tagok és szerepek',
    'event-editor-assets': 'Hozzárendelt erőforrások',
    'activity-event-entry': 'Eseménylista vezérlők',
    'activity-event-card': 'Egy eseménykártya',
    'activity-event-actions': 'Eseménykártya műveletek',
    'activity-event-join': 'Csatlakozási folyamat',
    'activity-event-hosting': 'Szervezői lehetőségek'
  }
};

const esc = value => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function svgFor(lang, context, section) {
  const theme = themeFor(section, context);
  const body = visualBody(lang, context, section, theme);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${theme.bg1}"/>
      <stop offset="1" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="960" height="540" rx="30" fill="url(#bg)"/>
  <rect x="6" y="6" width="948" height="528" rx="26" fill="#ffffff" opacity="0.82" stroke="${theme.stroke}" stroke-width="3"/>
  <g transform="matrix(1.16 0 0 1.16 -70 -78)">
    ${body}
  </g>
</svg>`;
}

function themeFor(section, context) {
  if (context === 'contacts' || section.includes('contacts')) {
    return { bg1: '#eefbf7', bg2: '#f8fbff', stroke: '#b8ddcf', main: '#24775e', alt: '#2d6fab' };
  }
  if (section.includes('chat')) {
    return { bg1: '#eefbf3', bg2: '#f8fbff', stroke: '#b9dcc7', main: '#217449', alt: '#3f7ee8' };
  }
  if (section.includes('asset') || context.includes('assets')) {
    return { bg1: '#fff5e8', bg2: '#f7fbff', stroke: '#ecd0a5', main: '#a56017', alt: '#2d6fab' };
  }
  if (section.includes('event')) {
    return { bg1: '#fff3eb', bg2: '#f8fbff', stroke: '#f0c5ab', main: '#bd6527', alt: '#2b6caf' };
  }
  if (section.includes('activity')) {
    return { bg1: '#f1f6ff', bg2: '#fff8ec', stroke: '#c8d9ef', main: '#275f9d', alt: '#f3973d' };
  }
  return { bg1: '#f2fbf8', bg2: '#fff8ed', stroke: '#cfe2d9', main: '#2b8b76', alt: '#f3973d' };
}

function visualBody(lang, context, section, theme) {
  switch (section) {
    case 'affinity':
      return sliderVisual(theme, lang === 'hu' ? 'Mehet ->' : 'Go ->');
    case 'affinity-network':
      return networkVisual(lang);
    case 'profile':
      return profileVisual(theme);
    case 'filters':
      return filterVisual(lang, theme);
    case 'history':
      return historyVisual(lang, theme);
    case 'activity-rate-filter':
      return activityFilterVisual(lang, theme);
    case 'activity-header-controls':
      return headerControlsVisual(lang, theme);
    case 'activity-score-badge':
      return scoreVisual(lang, theme);
    case 'activity-fullscreen':
      return fullscreenVisual(theme);
    case 'activity-chat-list':
      return chatListVisual(lang, theme);
    case 'activity-chat-card':
      return chatCardVisual(lang, theme);
    case 'activity-chat-channels':
      return channelVisual(lang, theme);
    case 'activity-chat-message-window':
      return chatWindowVisual(lang, theme);
    case 'activity-chat-tools':
      return chatToolsVisual(lang, theme);
    case 'contacts-list':
      return contactsListVisual(lang, theme);
    case 'contacts-card':
      return contactsCardVisual(lang, theme);
    case 'contacts-private-methods':
      return contactsMethodsVisual(lang, theme);
    case 'assets-entry':
      return assetEntryVisual(lang, context, theme);
    case 'assets-card':
      return assetCardVisual(lang, context, theme);
    case 'assets-editor':
      return editorGridVisual(lang, context, theme);
    case 'assets-requests':
      return requestsVisual(lang, theme);
    case 'assets-scope':
      return scopeVisual(lang, theme);
    case 'assets-tickets':
    case 'assets-ticket-card':
    case 'assets-ticket-scanner':
      return ticketVisual(lang, section, theme);
    case 'event-editor-main':
      return eventMainVisual(lang, theme);
    case 'event-editor-switches':
      return eventSwitchVisual(lang, theme);
    case 'event-editor-schedule':
      return eventScheduleVisual(lang, theme);
    case 'event-editor-subevents':
      return eventSubeventVisual(lang, theme);
    case 'event-editor-members':
      return membersVisual(lang, theme);
    case 'event-editor-assets':
      return resourcesVisual(lang, theme);
    case 'activity-event-entry':
      return eventEntryVisual(lang, theme);
    case 'activity-event-card':
      return eventCardVisual(lang, theme);
    case 'activity-event-actions':
      return eventActionsVisual(lang, theme);
    case 'activity-event-join':
      return eventJoinVisual(lang, theme);
    case 'activity-event-hosting':
      return eventHostingVisual(lang, theme);
    default:
      return genericVisual(section, theme);
  }
}

function pill(x, y, w, h, text, fill, stroke = '#bed2eb', color = '#1f4778') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
  <text x="${x + w / 2}" y="${y + h / 2 + 9}" text-anchor="middle" font-family="Arial, sans-serif" font-size="27" font-weight="900" fill="${color}">${esc(text)}</text>`;
}

function eyeIcon(cx, cy, scale = 1, color = '#245c9c') {
  return `<path d="M ${cx - 28 * scale} ${cy} C ${cx - 15 * scale} ${cy - 16 * scale}, ${cx + 15 * scale} ${cy - 16 * scale}, ${cx + 28 * scale} ${cy} C ${cx + 15 * scale} ${cy + 16 * scale}, ${cx - 15 * scale} ${cy + 16 * scale}, ${cx - 28 * scale} ${cy} Z" fill="none" stroke="${color}" stroke-width="${5 * scale}" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${cx}" cy="${cy}" r="${8 * scale}" fill="${color}"/>`;
}

function swapIcon(cx, cy, scale = 1, color = '#6846d8') {
  return `<path d="M ${cx - 11 * scale} ${cy - 15 * scale} L ${cx} ${cy - 26 * scale} L ${cx + 11 * scale} ${cy - 15 * scale}" fill="none" stroke="${color}" stroke-width="${4 * scale}" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="${cx}" y1="${cy - 24 * scale}" x2="${cx}" y2="${cy - 4 * scale}" stroke="${color}" stroke-width="${4 * scale}" stroke-linecap="round"/>
  <path d="M ${cx - 11 * scale} ${cy + 15 * scale} L ${cx} ${cy + 26 * scale} L ${cx + 11 * scale} ${cy + 15 * scale}" fill="none" stroke="${color}" stroke-width="${4 * scale}" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="${cx}" y1="${cy + 24 * scale}" x2="${cx}" y2="${cy + 4 * scale}" stroke="${color}" stroke-width="${4 * scale}" stroke-linecap="round"/>`;
}

function historyIcon(cx, cy, scale = 1, color = '#b77912') {
  return `<path d="M ${cx + 22 * scale} ${cy - 16 * scale} A ${30 * scale} ${30 * scale} 0 1 0 ${cx + 22 * scale} ${cy + 16 * scale}" fill="none" stroke="${color}" stroke-width="${7 * scale}" stroke-linecap="round"/>
  <path d="M ${cx + 18 * scale} ${cy - 28 * scale} L ${cx + 34 * scale} ${cy - 18 * scale} L ${cx + 16 * scale} ${cy - 9 * scale} Z" fill="${color}"/>
  <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 18 * scale}" stroke="${color}" stroke-width="${6 * scale}" stroke-linecap="round"/>
  <line x1="${cx}" y1="${cy}" x2="${cx + 17 * scale}" y2="${cy + 9 * scale}" stroke="${color}" stroke-width="${6 * scale}" stroke-linecap="round"/>`;
}

function starIcon(cx, cy, r = 18, fill = '#a56a19') {
  const points = [];
  for (let index = 0; index < 10; index++) {
    const angle = (-90 + index * 36) * Math.PI / 180;
    const radius = index % 2 === 0 ? r : r * 0.46;
    points.push(`${(cx + Math.cos(angle) * radius).toFixed(1)},${(cy + Math.sin(angle) * radius).toFixed(1)}`);
  }
  return `<polygon points="${points.join(' ')}" fill="${fill}"/>`;
}

function menuDots(cx, cy, color = '#245c9c') {
  return `<circle cx="${cx}" cy="${cy - 12}" r="4.6" fill="${color}"/><circle cx="${cx}" cy="${cy}" r="4.6" fill="${color}"/><circle cx="${cx}" cy="${cy + 12}" r="4.6" fill="${color}"/>`;
}

function personIcon(cx, cy, scale = 1, color = '#245c9c') {
  return `<circle cx="${cx}" cy="${cy - 8 * scale}" r="${9 * scale}" fill="${color}"/>
  <path d="M ${cx - 18 * scale} ${cy + 18 * scale} C ${cx - 14 * scale} ${cy + 4 * scale}, ${cx + 14 * scale} ${cy + 4 * scale}, ${cx + 18 * scale} ${cy + 18 * scale}" fill="none" stroke="${color}" stroke-width="${5 * scale}" stroke-linecap="round"/>`;
}

function globeIcon(cx, cy, r = 28, color = '#17633b') {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="5"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.42}" ry="${r}" fill="none" stroke="${color}" stroke-width="4"/>
  <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${color}" stroke-width="4"/>
  <path d="M ${cx - r * 0.82} ${cy - r * 0.45} C ${cx - r * 0.35} ${cy - r * 0.28}, ${cx + r * 0.35} ${cy - r * 0.28}, ${cx + r * 0.82} ${cy - r * 0.45}" fill="none" stroke="${color}" stroke-width="4"/>
  <path d="M ${cx - r * 0.82} ${cy + r * 0.45} C ${cx - r * 0.35} ${cy + r * 0.28}, ${cx + r * 0.35} ${cy + r * 0.28}, ${cx + r * 0.82} ${cy + r * 0.45}" fill="none" stroke="${color}" stroke-width="4"/>`;
}

function qrIcon(x, y, size = 82, color = '#245c9c') {
  const cell = size / 7;
  const boxes = [
    [0, 0, 3, 3], [4, 0, 3, 3], [0, 4, 3, 3],
    [4, 4, 1, 1], [6, 4, 1, 1], [4, 6, 1, 1], [5, 5, 2, 1], [3, 3, 1, 1]
  ];
  return boxes.map(([cx, cy, cw, ch]) => `<rect x="${x + cx * cell}" y="${y + cy * cell}" width="${cw * cell - 2}" height="${ch * cell - 2}" rx="2" fill="${color}"/>`).join('');
}

function chevron(x, y, color = '#9eb2ca') {
  return `<path d="M ${x} ${y - 34} L ${x + 28} ${y} L ${x} ${y + 34}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function sliderVisual(theme, button) {
  return `<rect x="126" y="150" width="708" height="82" rx="41" fill="#f7fbff" stroke="#c9d9ed" stroke-width="3"/>
  <rect x="174" y="184" width="500" height="20" rx="10" fill="#2f9ae5"/>
  <rect x="174" y="184" width="500" height="20" rx="10" fill="url(#sliderGrad)"/>
  <defs><linearGradient id="sliderGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2897e5"/><stop offset=".34" stop-color="#45c3bd"/><stop offset=".58" stop-color="#efe05b"/><stop offset=".78" stop-color="#f3973d"/><stop offset="1" stop-color="#ef4361"/></linearGradient></defs>
  <circle cx="588" cy="194" r="31" fill="#fff" stroke="#f3973d" stroke-width="9"/>
  <circle cx="734" cy="194" r="32" fill="#f3973d"/><text x="734" y="205" text-anchor="middle" font-family="Arial" font-size="30" font-weight="900" fill="#fff">7</text>
  <rect x="174" y="264" width="612" height="58" rx="18" fill="#6846d8"/>
  <text x="480" y="302" text-anchor="middle" font-family="Arial" font-size="26" font-weight="900" fill="#fff">${esc(button)}</text>
  ${lines(174, 374, 560, [1, .72, .86])}`;
}

function networkVisual(lang) {
  const group = lang === 'hu' ? '6-12 fős csoportchat' : '6-12 person group chat';
  const strong = lang === 'hu' ? 'erős kapcsolat' : 'strong link';
  const medium = lang === 'hu' ? 'közepes' : 'medium';
  const light = lang === 'hu' ? 'gyengébb' : 'lighter';
  return `<rect x="76" y="124" width="808" height="324" rx="24" fill="#f8fcff" stroke="#c7dbed" stroke-width="3"/>
  <text x="106" y="163" font-family="Arial" font-size="22" font-weight="900" fill="#315170">${lang === 'hu' ? 'Kölcsönös érdeklődés' : 'Mutual interest'}</text>
  ${pill(560, 138, 300, 42, group, '#e8f8ef', '#88cfad', '#1f6d4d')}
  <g transform="translate(110 190) scale(1.18)">
    ${grid(0, 0, 640, 158)}
    ${edge(95, 78, 200, 30, '#f4973d', 8)}${edge(95, 78, 190, 125, '#36ad9c', 6)}${edge(200, 30, 310, 28, '#f4973d', 8)}${edge(310, 28, 438, 75, '#f4973d', 8)}
    ${edge(200, 30, 286, 124, '#36ad9c', 6)}${edge(190, 125, 286, 124, '#86a3bd', 5)}${edge(286, 124, 438, 75, '#36ad9c', 6)}
    ${node(95, 78, 'Te', '#e7f2ff')}${node(200, 30, 'A')}${node(190, 125, 'B')}${node(310, 28, 'C')}${node(286, 124, 'D')}${node(360, 118, 'E')}${node(438, 75, 'Chat', '#fff4df', 25)}
    ${smallText(145, 38, '92')}${smallText(250, 20, '89')}${smallText(374, 38, '94')}${smallText(150, 112, '74')}${smallText(240, 82, '68')}${smallText(326, 132, '66')}
  </g>
  <rect x="106" y="424" width="44" height="8" rx="4" fill="#f4973d"/><text x="159" y="433" font-family="Arial" font-size="20" font-weight="800" fill="#52677f">${esc(strong)}</text>
  <rect x="306" y="424" width="44" height="6" rx="3" fill="#36ad9c"/><text x="359" y="433" font-family="Arial" font-size="20" font-weight="800" fill="#52677f">${esc(medium)}</text>
  <rect x="458" y="425" width="44" height="5" rx="3" fill="#86a3bd"/><text x="511" y="433" font-family="Arial" font-size="20" font-weight="800" fill="#52677f">${esc(light)}</text>`;
}

function profileVisual() {
  return `<rect x="198" y="144" width="564" height="300" rx="24" fill="#20344f"/>
  <rect x="198" y="144" width="564" height="300" rx="24" fill="url(#profileGrad)"/>
  <defs><linearGradient id="profileGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#87a7bd"/><stop offset=".55" stop-color="#d9cfaa"/><stop offset="1" stop-color="#172945"/></linearGradient></defs>
  <rect x="228" y="168" width="150" height="8" rx="4" fill="#fff" opacity=".9"/><rect x="386" y="168" width="150" height="8" rx="4" fill="#fff" opacity=".7"/><rect x="544" y="168" width="150" height="8" rx="4" fill="#fff" opacity=".55"/>
  <circle cx="250" cy="360" r="30" fill="#f4fbff" stroke="#bcd8ef" stroke-width="3"/>${swapIcon(250, 360, 0.55)}
  <circle cx="320" cy="360" r="30" fill="#e9f8ff" stroke="#bcd8ef" stroke-width="3"/>${eyeIcon(320, 360, 0.55)}
  <text x="232" y="414" font-family="Arial" font-size="26" font-weight="900" fill="#fff">Noel Safety</text><text x="232" y="442" font-family="Arial" font-size="20" font-weight="800" fill="#e6eef8">6.8 km</text>`;
}

function filterVisual(lang, theme) {
  const prefs = lang === 'hu' ? 'Preferenciák' : 'Preferences';
  const common = lang === 'hu' ? 'Közös ismerősök' : 'Friends in Common';
  const inside = lang === 'hu' ? 'Hálózaton belül' : 'Inside Network';
  const outside = lang === 'hu' ? 'Hálózaton kívül' : 'Outside Network';
  return `${pill(140, 150, 440, 58, `${prefs} v`, '#eaf4ff', '#a8c8ef')}${personIcon(176, 178, 0.72)}
  ${pill(604, 150, 112, 58, '5', '#e7f8ed', '#9ad5b0', '#17633b')}
  ${menuRows(140, 230, 680, [prefs, common, inside, outside], ['#eaf4ff', '#e8f8ef', '#fff2df', '#f0eafa'])}`;
}

function historyVisual(lang) {
  const rating = lang === 'hu' ? 'Értékelések' : 'Ratings';
  return `<circle cx="148" cy="250" r="66" fill="#fff7df" stroke="#efbd5d" stroke-width="4"/>${historyIcon(148, 250, 1)}
  <circle cx="196" cy="196" r="25" fill="#dc4d57"/><text x="196" y="205" text-anchor="middle" font-family="Arial" font-size="21" font-weight="900" fill="#fff">3</text>
  <line x1="220" y1="250" x2="602" y2="250" stroke="#e8d4a5" stroke-width="6"/>
  <rect x="602" y="188" width="280" height="124" rx="22" fill="#fff2d5" stroke="#efbd5d" stroke-width="4"/>${starIcon(742, 231, 29)}<text x="742" y="286" text-anchor="middle" font-family="Arial" font-size="28" font-weight="900" fill="#8a5a14">${esc(rating)}</text>`;
}

function activityFilterVisual(lang) {
  const labels = lang === 'hu' ? ['adott', 'kapott', 'kölcsönös', 'találkozott'] : ['given', 'received', 'mutual', 'met'];
  return `${pill(150, 145, 430, 58, `↗ ${lang === 'hu' ? 'preferenciák · adott' : 'preferences · given'}`, '#ffeaf1', '#eba9bd', '#9a3b54')}
  ${menuRows(170, 228, 360, labels, ['#fff2f6', '#f1f8ff', '#f1f3ff', '#effaf2'])}
  <circle cx="500" cy="174" r="24" fill="#d94a4a"/><text x="500" y="183" text-anchor="middle" font-family="Arial" font-size="20" font-weight="900" fill="#fff">2</text>
  <rect x="590" y="242" width="210" height="126" rx="18" fill="#fff" stroke="#c7d9ef" stroke-width="3"/>
  <text x="620" y="286" font-family="Arial" font-size="22" font-weight="900" fill="#1d3354">Social off</text>
  <text x="620" y="326" font-family="Arial" font-size="20" font-weight="850" fill="#61728f">Social on</text>`;
}

function headerControlsVisual(lang) {
  const latest = lang === 'hu' ? 'Legutóbbi' : 'Recent';
  const rel = lang === 'hu' ? 'Releváns' : 'Relevant';
  const past = lang === 'hu' ? 'Korábbi' : 'Past';
  const dist = lang === 'hu' ? 'Távolság' : 'Distance';
  return `${pill(135, 142, 190, 52, latest, '#edf6ff')}
  ${pill(340, 142, 190, 52, dist, '#edf6ff')}
  ${menuRows(150, 226, 280, [latest, rel, past], ['#fff', '#fff', '#fff'])}
  ${menuRows(482, 226, 280, [lang === 'hu' ? 'Hónap' : 'Month', lang === 'hu' ? 'Hét' : 'Week', lang === 'hu' ? 'Nap' : 'Day'], ['#edf6ff', '#edf6ff', '#edf6ff'])}
  <rect x="150" y="404" width="660" height="42" rx="13" fill="#f5f9ff" stroke="#c6d8ee" stroke-width="3"/><text x="175" y="432" font-family="Arial" font-size="22" font-weight="900" fill="#1d3354">10 km</text>`;
}

function scoreVisual(lang) {
  const score = lang === 'hu' ? 'Pont' : 'Score';
  const rate = lang === 'hu' ? 'Értékelés' : 'Rate';
  return `<rect x="170" y="150" width="620" height="210" rx="22" fill="#20344f"/><rect x="614" y="178" width="138" height="58" rx="29" fill="#ffe7a6" stroke="#d3a33d" stroke-width="3"/>${starIcon(658, 207, 18)}<text x="694" y="216" text-anchor="middle" font-family="Arial" font-size="30" font-weight="900" fill="#a56a19">4</text>
  <text x="612" y="292" font-family="Arial" font-size="31" font-weight="900" fill="#fff">${esc(score)}</text><text x="612" y="326" font-family="Arial" font-size="24" font-weight="900" fill="#fff">${esc(rate)}</text>
  <rect x="170" y="395" width="620" height="18" rx="9" fill="#dfe8f2"/><rect x="170" y="395" width="410" height="18" rx="9" fill="#f3973d"/><circle cx="580" cy="404" r="28" fill="#8eea10" stroke="#fff" stroke-width="5"/>`;
}

function fullscreenVisual() {
  return `<rect x="170" y="132" width="620" height="286" rx="24" fill="#20344f"/>
  <rect x="190" y="150" width="180" height="8" rx="4" fill="#fff"/><rect x="380" y="150" width="180" height="8" rx="4" fill="#fff" opacity=".7"/><rect x="570" y="150" width="180" height="8" rx="4" fill="#fff" opacity=".55"/>
  <circle cx="740" cy="380" r="36" fill="#e9fbff"/>${eyeIcon(740, 380, 0.72)}
  <rect x="170" y="438" width="620" height="18" rx="9" fill="#dfe8f2"/><rect x="170" y="438" width="410" height="18" rx="9" fill="#f3973d"/><circle cx="580" cy="447" r="28" fill="#8eea10" stroke="#fff" stroke-width="5"/>`;
}

function chatListVisual(lang) {
  return `${pill(140, 144, 270, 54, `${lang === 'hu' ? 'Chatek' : 'Chats'} 9+`, '#eaf4ff')}
  ${pill(430, 144, 270, 54, `${lang === 'hu' ? 'Összes' : 'All'} 5`, '#e8f8ef', '#9ad5b0', '#17633b')}
  ${menuRows(150, 230, 660, [lang === 'hu' ? 'Esemény' : 'Event', lang === 'hu' ? 'Alesemény' : 'Sub event', lang === 'hu' ? 'Csoport' : 'Group', lang === 'hu' ? 'Szerviz' : 'Service'], ['#fff', '#fff', '#fff', '#fff'])}
  <rect x="150" y="410" width="660" height="42" rx="13" fill="#f5f9ff" stroke="#c6d8ee" stroke-width="3"/><text x="175" y="438" font-family="Arial" font-size="22" font-weight="900" fill="#1d3354">2026. Jun. 2.</text>`;
}

function chatCardVisual(lang) {
  const members = lang === 'hu' ? '4 tag' : '4 members';
  return `<rect x="128" y="184" width="704" height="166" rx="22" fill="#eaf8ef" stroke="#9ad5b0" stroke-width="3"/>
  <circle cx="196" cy="267" r="38" fill="#4f7fe8"/><text x="196" y="278" text-anchor="middle" font-family="Arial" font-size="24" font-weight="900" fill="#fff">NH</text>
  <text x="260" y="242" font-family="Arial" font-size="28" font-weight="900" fill="#1d3354">Noah Hart</text>
  <text x="260" y="276" font-family="Arial" font-size="22" font-weight="800" fill="#4f6585">Phoenix Sunday Walk · Main Event</text>
  <text x="260" y="310" font-family="Arial" font-size="21" font-weight="800" fill="#61728f">${lang === 'hu' ? 'Találkozó helye rendben?' : 'Meeting spot ok?'}</text>
  ${pill(650, 236, 130, 54, members, '#33445c', '#33445c', '#fff')}
  <circle cx="780" cy="226" r="21" fill="#d94a4a"/><text x="780" y="234" text-anchor="middle" font-family="Arial" font-size="18" font-weight="900" fill="#fff">1</text>`;
}

function channelVisual(lang) {
  return menuRows(170, 160, 620, [lang === 'hu' ? 'Main event' : 'Main event', lang === 'hu' ? 'Alesemény' : 'Sub event', lang === 'hu' ? 'Csoport' : 'Group', lang === 'hu' ? 'Szervező' : 'Organizer'], ['#edf6ff', '#edf6ff', '#eaf8ef', '#fff4e8']);
}

function chatWindowVisual(lang) {
  return `<rect x="116" y="126" width="728" height="340" rx="22" fill="#f5fbfb" stroke="#c7dbed" stroke-width="3"/>
  <text x="150" y="174" font-family="Arial" font-size="25" font-weight="900" fill="#1d3354">Main event</text>${pill(628, 142, 120, 38, lang === 'hu' ? '4 tag' : '4 members', '#eaf4ff')}
  <rect x="150" y="205" width="278" height="54" rx="16" fill="#fff" stroke="#d6e2f0" stroke-width="2"/><text x="174" y="239" font-family="Arial" font-size="20" font-weight="850" fill="#1d3354">${lang === 'hu' ? 'Találkozó helye?' : 'Meeting spot?'}</text>
  <rect x="150" y="278" width="330" height="82" rx="16" fill="#fff" stroke="#d6e2f0" stroke-width="2"/><rect x="174" y="296" width="96" height="48" rx="10" fill="#cddcec"/><text x="288" y="326" font-family="Arial" font-size="20" font-weight="900" fill="#1d3354">Shared event</text>
  <rect x="536" y="292" width="270" height="58" rx="18" fill="#2460a5"/><text x="671" y="328" text-anchor="middle" font-family="Arial" font-size="20" font-weight="900" fill="#fff">Yes, see you there.</text>
  <rect x="536" y="258" width="176" height="32" rx="16" fill="#fff" stroke="#d6e2f0"/><text x="576" y="280" text-anchor="middle" font-family="Arial" font-size="20" font-weight="900" fill="#245c9c">Reply</text><circle cx="636" cy="274" r="8" fill="none" stroke="#245c9c" stroke-width="2"/><circle cx="633" cy="272" r="1.5" fill="#245c9c"/><circle cx="639" cy="272" r="1.5" fill="#245c9c"/><path d="M 631 278 Q 636 282 641 278" fill="none" stroke="#245c9c" stroke-width="2" stroke-linecap="round"/>${menuDots(678, 274)}
  <rect x="150" y="394" width="656" height="44" rx="13" fill="#fff" stroke="#c7dbed" stroke-width="3"/><text x="478" y="423" text-anchor="middle" font-family="Arial" font-size="20" font-weight="850" fill="#245c9c">${lang === 'hu' ? 'Üzenet írása' : 'Write message'}</text>`;
}

function chatToolsVisual(lang) {
  return `<circle cx="230" cy="265" r="45" fill="#edf6ff" stroke="#a8c8ef" stroke-width="3"/><text x="230" y="279" text-anchor="middle" font-family="Arial" font-size="42" font-weight="900" fill="#245c9c">+</text>
  ${menuRows(330, 180, 350, [lang === 'hu' ? 'Kép' : 'Image', lang === 'hu' ? 'Hang' : 'Voice', lang === 'hu' ? 'Szavazás' : 'Poll', lang === 'hu' ? 'Esemény' : 'Event', lang === 'hu' ? 'Eszköz' : 'Asset'], ['#fff', '#fff', '#fff', '#fff', '#fff'])}`;
}

function contactsListVisual(lang) {
  const create = lang === 'hu' ? 'Kapcsolat létrehozása' : 'Create contact';
  const search = lang === 'hu' ? 'Kapcsolatok szűrése A-Z' : 'Filter contacts A-Z';
  const none = lang === 'hu' ? 'Nincsenek kapcsolatok' : 'No contacts';
  const empty = lang === 'hu' ? 'Még nincs mentett kapcsolat' : 'No saved contacts yet';
  return `${pill(500, 124, 340, 48, create, '#eaf4ff', '#a8c8ef', '#1f4778')}
  <rect x="112" y="196" width="736" height="64" rx="32" fill="#fff" stroke="#c7d9ef" stroke-width="3"/>
  <circle cx="158" cy="228" r="14" fill="none" stroke="#1d3354" stroke-width="5"/><line x1="168" y1="238" x2="182" y2="252" stroke="#1d3354" stroke-width="5" stroke-linecap="round"/>
  <text x="218" y="239" font-family="Arial" font-size="25" font-weight="850" fill="#8a9ab0">${esc(search)}</text>
  <rect x="112" y="298" width="736" height="44" rx="12" fill="#f4f8fd" stroke="#c7d9ef" stroke-width="3"/>
  <text x="136" y="327" font-family="Arial" font-size="22" font-weight="900" fill="#1d3354">${esc(none)}</text>
  <rect x="112" y="382" width="736" height="82" rx="20" fill="#f8fbff" stroke="#c7d9ef" stroke-dasharray="9 8" stroke-width="3"/>
  <text x="480" y="430" text-anchor="middle" font-family="Arial" font-size="27" font-weight="900" fill="#1d3354">${esc(empty)}</text>`;
}

function contactsCardVisual(lang) {
  const methods = lang === 'hu' ? ['Email', 'Telefon', 'Instagram'] : ['Email', 'Phone', 'Instagram'];
  return `<rect x="76" y="112" width="808" height="356" rx="24" fill="#f8fcff" stroke="#c7dbed" stroke-width="3"/>
  <rect x="110" y="148" width="740" height="188" rx="24" fill="#fff" stroke="#c7d9ef" stroke-width="3"/>
  <circle cx="178" cy="242" r="48" fill="#4f7fe8"/><text x="178" y="256" text-anchor="middle" font-family="Arial" font-size="31" font-weight="900" fill="#fff">NE</text>
  <text x="252" y="214" font-family="Arial" font-size="31" font-weight="900" fill="#1d3354">Nagy Eszter</text>
  <text x="252" y="254" font-family="Arial" font-size="22" font-weight="850" fill="#52677f">${lang === 'hu' ? 'Kreatív hétvégék · Seattle' : 'Creative weekends · Seattle'}</text>
  <text x="252" y="292" font-family="Arial" font-size="21" font-weight="850" fill="#61728f">${lang === 'hu' ? 'Gyors elérés kártya' : 'Quick reach card'}</text>
  <circle cx="726" cy="230" r="34" fill="#fff" stroke="#c7d9ef" stroke-width="3"/>${eyeIcon(726, 230, 0.62)}
  <circle cx="794" cy="230" r="34" fill="#fff" stroke="#c7d9ef" stroke-width="3"/>${menuDots(794, 230)}
  <g transform="translate(124 360)">${methodChip(0, methods[0], '#e8f8ef', '#24775e')}${methodChip(174, methods[1], '#edf6ff', '#245c9c')}${methodChip(348, methods[2], '#fff2df', '#a56017')}</g>
  ${compactRows(642, 346, 210, [lang === 'hu' ? 'Szerkesztés' : 'Edit', lang === 'hu' ? 'Törlés' : 'Delete'], ['#f0eafa', '#fdecef'])}`;
}

function contactsMethodsVisual(lang) {
  const heading = lang === 'hu' ? 'Elérési módok' : 'Reach methods';
  const add = lang === 'hu' ? 'Mód hozzáadása' : 'Add method';
  const save = lang === 'hu' ? 'Mentés' : 'Save';
  return `<rect x="94" y="112" width="772" height="356" rx="24" fill="#f8fcff" stroke="#c7dbed" stroke-width="3"/>
  <circle cx="146" cy="172" r="38" fill="#4f7fe8"/><text x="146" y="184" text-anchor="middle" font-family="Arial" font-size="24" font-weight="900" fill="#fff">NE</text>
  <text x="204" y="162" font-family="Arial" font-size="29" font-weight="900" fill="#1d3354">Edit Contact</text>
  <text x="204" y="196" font-family="Arial" font-size="22" font-weight="850" fill="#52677f">${esc(heading)}</text>
  ${pill(554, 144, 260, 46, add, '#eaf4ff', '#a8c8ef', '#1f4778')}
  ${methodRow(134, 250, 'Email', 'eszter@example.com', '#e8f8ef')}
  ${methodRow(134, 328, lang === 'hu' ? 'Telefon' : 'Phone', '+36 20 555 0123', '#edf6ff')}
  ${pill(610, 414, 160, 46, save, '#e8f8ef', '#9ad5b0', '#17633b')}`;
}

function methodChip(x, text, fill, color) {
  return `<rect x="${x}" y="0" width="150" height="44" rx="22" fill="${fill}" stroke="#c7d9ef" stroke-width="3"/>
  <circle cx="${x + 26}" cy="22" r="10" fill="${color}"/>
  <text x="${x + 46}" y="30" font-family="Arial" font-size="19" font-weight="900" fill="${color}">${esc(text)}</text>`;
}

function methodRow(x, y, label, value, fill) {
  return `<rect x="${x}" y="${y}" width="692" height="56" rx="16" fill="#fff" stroke="#d6e2f0" stroke-width="3"/>
  <rect x="${x + 18}" y="${y + 12}" width="142" height="32" rx="16" fill="${fill}" stroke="#c7d9ef" stroke-width="2"/>
  <text x="${x + 89}" y="${y + 34}" text-anchor="middle" font-family="Arial" font-size="18" font-weight="900" fill="#1f4778">${esc(label)}</text>
  <text x="${x + 194}" y="${y + 36}" font-family="Arial" font-size="21" font-weight="850" fill="#1d3354">${esc(value)}</text>
  <circle cx="${x + 648}" cy="${y + 28}" r="18" fill="#fdecef" stroke="#eaa7ad" stroke-width="2"/><text x="${x + 648}" y="${y + 36}" text-anchor="middle" font-family="Arial" font-size="24" font-weight="900" fill="#9b2f38">×</text>`;
}

function assetEntryVisual(lang, context) {
  const names = lang === 'hu' ? ['Autó 4', 'Ingatlan 2', 'Kellékek 8', 'Jegy 5'] : ['Car 4', 'Accommodation 2', 'Supplies 8', 'Ticket 5'];
  return `<rect x="84" y="112" width="792" height="350" rx="24" fill="#f7fbff" stroke="#c7dbed" stroke-width="3"/>
  ${compactRows(140, 150, 570, names, ['#eaf4ff', '#eaf8ef', '#fff2df', '#f0eafa'])}
  <circle cx="768" cy="318" r="50" fill="#edf6ff" stroke="#c7dbed" stroke-width="4"/><text x="768" y="336" text-anchor="middle" font-family="Arial" font-size="56" font-weight="900" fill="#245c9c">+</text>`;
}

function assetCardVisual(lang, context) {
  const type = context.includes('accommodation') ? (lang === 'hu' ? 'Ingatlan' : 'Accommodation') : context.includes('supplies') ? (lang === 'hu' ? 'Kellék' : 'Supplies') : (lang === 'hu' ? 'Autó' : 'Car');
  return `<rect x="78" y="112" width="520" height="350" rx="24" fill="#fff" stroke="#c7d9ef" stroke-width="3"/>
  <rect x="104" y="138" width="468" height="170" rx="16" fill="url(#assetPhoto)"/><defs><linearGradient id="assetPhoto" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9bb79"/><stop offset="1" stop-color="#8db8c0"/></linearGradient></defs>
  <text x="132" y="360" font-family="Arial" font-size="28" font-weight="900" fill="#1d3354">City-to-Lake SUV</text>
  <text x="132" y="394" font-family="Arial" font-size="22" font-weight="850" fill="#52677f">${esc(type)} · Austin</text>
  <circle cx="540" cy="360" r="31" fill="#fff" stroke="#c7d9ef" stroke-width="3"/>${menuDots(540, 360)}
  ${compactRows(636, 172, 236, [lang === 'hu' ? 'Megosztás' : 'Share', lang === 'hu' ? 'Szerkesztés' : 'Edit', lang === 'hu' ? 'Törlés' : 'Delete'], ['#edf6ff', '#f0eafa', '#fdecef'])}`;
}

function editorGridVisual(lang, context) {
  return `<rect x="116" y="132" width="728" height="314" rx="22" fill="#f8fcff" stroke="#c7dbed" stroke-width="3"/>
  <rect x="144" y="172" width="150" height="190" rx="16" fill="#eaf4ff" stroke="#b9d1ee" stroke-dasharray="10 9" stroke-width="3"/><text x="219" y="280" text-anchor="middle" font-family="Arial" font-size="44" font-weight="900" fill="#245c9c">+</text>
  ${field(318, 172, 'Source', 'https://...')}${field(480, 172, 'Type', context.includes('accommodation') ? 'Accommodation' : context.includes('supplies') ? 'Supplies' : 'Car')}${field(642, 172, 'Title *', 'City-to-Lake SUV')}
  ${field(318, 270, 'Category', 'Ride')}${field(480, 270, 'Capacity *', '4')}${field(642, 270, 'Quantity *', '1')}
  <rect x="318" y="370" width="486" height="46" rx="12" fill="#e8f8ef" stroke="#9ad5b0" stroke-width="3"/><text x="561" y="400" text-anchor="middle" font-family="Arial" font-size="20" font-weight="900" fill="#17633b">${lang === 'hu' ? 'Nyilvános · Mentés' : 'Public · Save'}</text>`;
}

function requestsVisual(lang) {
  return `<rect x="140" y="142" width="680" height="300" rx="22" fill="#f8fcff" stroke="#c7dbed" stroke-width="3"/>
  ${pill(170, 172, 120, 42, lang === 'hu' ? 'Összes' : 'All', '#edf6ff')}${pill(306, 172, 140, 42, lang === 'hu' ? 'Függő 2' : 'Pending 2', '#fff2f6', '#eba9bd', '#9a3b54')}${pill(462, 172, 150, 42, lang === 'hu' ? 'Kiadva' : 'Borrowed', '#fff4e8')}
  ${requestRow(170, 248, 'Grace Bell', lang === 'hu' ? 'Jóváhagyás' : 'Approve')}${requestRow(170, 330, 'Maya Stone', lang === 'hu' ? 'Manager' : 'Manager')}`;
}

function scopeVisual(lang) {
  return `<circle cx="142" cy="274" r="72" fill="#e8f8ef" stroke="#9ad5b0" stroke-width="4"/>${globeIcon(142, 274, 40)}
  <line x1="222" y1="274" x2="412" y2="274" stroke="#a8bed8" stroke-width="10" stroke-linecap="round"/>
  <circle cx="492" cy="274" r="72" fill="#edf6ff" stroke="#a8c8ef" stroke-width="4"/>${starIcon(492, 274, 36, '#245c9c')}
  <line x1="572" y1="274" x2="696" y2="274" stroke="#a8bed8" stroke-width="10" stroke-linecap="round"/>
  <rect x="690" y="198" width="190" height="152" rx="24" fill="#fff4e8" stroke="#e5bf89" stroke-width="4"/><text x="785" y="258" text-anchor="middle" font-family="Arial" font-size="31" font-weight="900" fill="#a56017">${lang === 'hu' ? 'Esemény' : 'Event'}</text><text x="785" y="298" text-anchor="middle" font-family="Arial" font-size="26" font-weight="850" fill="#a56017">Assign</text>`;
}

function ticketVisual(lang, section) {
  const upcoming = lang === 'hu' ? 'Közelgő' : 'Upcoming';
  const scan = 'Scan Ticket';
  if (section === 'assets-tickets') {
    return `${pill(92, 118, 160, 46, lang === 'hu' ? 'jegy' : 'ticket', '#edf6ff')}
    ${pill(680, 118, 200, 46, scan, '#fdecef', '#eaa7ad', '#9b2f38')}
    <rect x="74" y="186" width="812" height="42" rx="12" fill="#f4f8fd" stroke="#c7d9ef" stroke-width="3"/><text x="100" y="214" font-family="Arial" font-size="22" font-weight="900" fill="#1d3354">${upcoming}</text>
    <rect x="92" y="258" width="360" height="184" rx="22" fill="#fff" stroke="#c7d9ef" stroke-width="3"/>
    <rect x="112" y="278" width="320" height="84" rx="15" fill="#7ca9c4"/>
    <circle cx="132" cy="300" r="24" fill="#25707c"/><text x="132" y="308" text-anchor="middle" font-family="Arial" font-size="17" font-weight="900" fill="#fff">TL</text>
    <circle cx="402" cy="300" r="28" fill="#263e5c"/>${qrIcon(388, 286, 28, '#fff')}
    <text x="114" y="398" font-family="Arial" font-size="24" font-weight="900" fill="#1d3354">Creative Studio Meetup</text>
    <text x="114" y="428" font-family="Arial" font-size="20" font-weight="850" fill="#52677f">Sat, May 30 · Ticket</text>`;
  }
  if (section === 'assets-ticket-card') {
    return `<rect x="110" y="118" width="740" height="342" rx="24" fill="#fff" stroke="#c7d9ef" stroke-width="3"/>
    <rect x="138" y="146" width="684" height="178" rx="18" fill="#7ca9c4"/>
    <circle cx="178" cy="184" r="30" fill="#25707c"/><text x="178" y="194" text-anchor="middle" font-family="Arial" font-size="19" font-weight="900" fill="#fff">TL</text>
    <circle cx="778" cy="188" r="38" fill="#263e5c"/>${qrIcon(759, 169, 38, '#fff')}
    <text x="158" y="374" font-family="Arial" font-size="30" font-weight="900" fill="#1d3354">Creative Studio Meetup</text>
    <text x="158" y="412" font-family="Arial" font-size="23" font-weight="850" fill="#52677f">${lang === 'hu' ? 'Esemény · jegykód megnyitása' : 'Event · open ticket code'}</text>`;
  }
  return `<rect x="104" y="112" width="752" height="360" rx="26" fill="#f8fcff" stroke="#c7dbed" stroke-width="3"/>
  <rect x="150" y="146" width="360" height="286" rx="26" fill="#20344f"/>
  <text x="330" y="190" text-anchor="middle" font-family="Arial" font-size="28" font-weight="900" fill="#dce8f5">${lang === 'hu' ? 'Szkenner' : 'Scanner'}</text>
  <rect x="220" y="226" width="220" height="150" rx="20" fill="#fff" opacity=".12" stroke="#9ac0e8" stroke-width="5" stroke-dasharray="18 14"/>
  ${qrIcon(288, 262, 84, '#fff')}
  <rect x="548" y="170" width="250" height="230" rx="22" fill="#fff" stroke="#d6e2f0" stroke-width="3"/>
  <text x="574" y="218" font-family="Arial" font-size="25" font-weight="900" fill="#1d3354">${lang === 'hu' ? 'Találat' : 'Match found'}</text>
  <text x="574" y="264" font-family="Arial" font-size="21" font-weight="850" fill="#52677f">Creative Studio Meetup</text>
  <text x="574" y="300" font-family="Arial" font-size="21" font-weight="850" fill="#52677f">TL · ${lang === 'hu' ? 'Elfogadva' : 'Accepted'}</text>
  ${pill(574, 336, 168, 46, lang === 'hu' ? 'Beléptetés' : 'Check in', '#e8f8ef', '#9ad5b0', '#17633b')}`;
}

function eventMainVisual(lang) {
  return `<rect x="128" y="126" width="704" height="318" rx="22" fill="#fff8f4" stroke="#efc6af" stroke-width="3"/>
  <rect x="164" y="160" width="632" height="92" rx="18" fill="#eaf4ff" stroke="#b9d1ee" stroke-dasharray="11 9" stroke-width="3"/><text x="480" y="218" text-anchor="middle" font-family="Arial" font-size="40" font-weight="900" fill="#245c9c">+</text>
  ${field(164, 276, lang === 'hu' ? 'Név *' : 'Name *', 'Phoenix Sunday Walk')}${field(514, 276, lang === 'hu' ? 'Létszám *' : 'Capacity *', '1 - 5')}
  <rect x="164" y="368" width="632" height="46" rx="12" fill="#fff" stroke="#ff4c4c" stroke-width="3"/><text x="190" y="398" font-family="Arial" font-size="20" font-weight="850" fill="#61728f">${lang === 'hu' ? 'Leírás *' : 'Description *'}</text>`;
}

function eventSwitchVisual(lang) {
  return `${pill(120, 150, 210, 52, lang === 'hu' ? 'Nyílt' : 'Public', '#e8f8ef', '#9ad5b0', '#17633b')}
  ${pill(348, 150, 210, 52, 'Topics', '#f0eafa', '#cebaf1', '#5c45a0')}
  ${pill(576, 150, 240, 52, lang === 'hu' ? 'Auto meghívó' : 'Auto Inviter', '#eaf4ff')}
  ${menuRows(160, 250, 620, [lang === 'hu' ? 'Open Event' : 'Open Event', 'Blind Event', 'Ticketing QR', lang === 'hu' ? 'Prioritási lista' : 'Priority list'], ['#e8f8ef', '#fde9df', '#eaf4ff', '#fff4e8'])}`;
}

function eventScheduleVisual(lang) {
  return `<rect x="126" y="142" width="708" height="120" rx="22" fill="#edf6ff" stroke="#c7dbed" stroke-width="3"/><text x="160" y="190" font-family="Arial" font-size="28" font-weight="900" fill="#245c9c">${lang === 'hu' ? 'Dátum' : 'Date'}</text>${pill(652, 170, 130, 44, 'one-time', '#fff4e8', '#e5bf89', '#a56017')}
  ${field(160, 292, 'Start', '2026/05/23')}${field(390, 292, 'End', '2026/05/23')}${menuRows(620, 292, 190, ['Pricing OFF', 'Policies'], ['#edf6ff', '#f0eafa'])}`;
}

function eventSubeventVisual(lang) {
  return `<rect x="110" y="130" width="740" height="330" rx="22" fill="#f8fcff" stroke="#c7dbed" stroke-width="3"/>
  ${pill(150, 164, 160, 46, lang === 'hu' ? 'Casual' : 'Casual', '#e8f8ef', '#9ad5b0', '#17633b')}${pill(330, 164, 190, 46, lang === 'hu' ? 'Bajnokság' : 'Tournament', '#fff4e8', '#e5bf89', '#a56017')}
  <rect x="150" y="244" width="280" height="146" rx="18" fill="#fff" stroke="#c7dbed" stroke-width="3"/><text x="178" y="288" font-family="Arial" font-size="26" font-weight="900" fill="#1d3354">Sub Event 1</text><text x="178" y="324" font-family="Arial" font-size="22" font-weight="850" fill="#52677f">00:04 - 01:04</text>
  <rect x="484" y="244" width="280" height="146" rx="18" fill="#fff" stroke="#c7dbed" stroke-width="3"/><text x="512" y="286" font-family="Arial" font-size="26" font-weight="900" fill="#1d3354">${lang === 'hu' ? 'Szakasz 1' : 'Stage 1'}</text><text x="512" y="326" font-family="Arial" font-size="22" font-weight="850" fill="#245c9c">${lang === 'hu' ? 'Csoport A 4 / 7' : 'Group A 4 / 7'}</text>`;
}

function membersVisual(lang) {
  return `<rect x="126" y="142" width="708" height="300" rx="22" fill="#f8fcff" stroke="#c7dbed" stroke-width="3"/>
  ${pill(160, 172, 150, 42, lang === 'hu' ? 'Meghívás' : 'Invite', '#edf6ff')}${pill(328, 172, 150, 42, lang === 'hu' ? 'Függő 2' : 'Pending 2', '#edf6ff')}${pill(496, 172, 100, 42, '1 / 5', '#edf6ff')}
  ${memberRow(160, 250, 'NH', 'Noah Hart', 'Admin')}${memberRow(160, 334, 'GB', 'Grace Bell', lang === 'hu' ? 'Függő' : 'Pending')}`;
}

function resourcesVisual(lang) {
  return `<rect x="104" y="116" width="752" height="352" rx="24" fill="#f8fcff" stroke="#c7dbed" stroke-width="3"/>
  ${pill(150, 150, 250, 46, lang === 'hu' ? 'Tagok' : 'Members', '#fff')}${pill(430, 150, 250, 46, lang === 'hu' ? 'Autó' : 'Car', '#fff')}
  ${pill(150, 214, 250, 46, lang === 'hu' ? 'Ingatlan' : 'Accommodation', '#fff')}${pill(430, 214, 250, 46, lang === 'hu' ? 'Kellékek' : 'Supplies', '#fff')}
  <rect x="150" y="294" width="530" height="66" rx="16" fill="#fff" stroke="#d6e2f0" stroke-width="3"/><text x="178" y="334" font-family="Arial" font-size="22" font-weight="900" fill="#1d3354">Ride seats · 2 accepted · 1 pending</text>
  ${pill(150, 386, 110, 46, '+', '#edf6ff')}${pill(286, 386, 150, 46, 'Assign', '#edf6ff')}${pill(462, 386, 170, 46, lang === 'hu' ? 'Felfedezés' : 'Explore', '#edf6ff')}`;
}

function eventEntryVisual(lang) {
  return `${pill(132, 138, 188, 44, lang === 'hu' ? 'Események' : 'Events', '#fff4e8', '#e5bf89', '#a56017')}${pill(340, 138, 160, 44, lang === 'hu' ? 'Összes 1' : 'All 1', '#fff4e8', '#e5bf89', '#a56017')}
  ${pill(132, 202, 156, 42, lang === 'hu' ? 'Közelgő' : 'Upcoming', '#edf6ff')}${pill(304, 202, 112, 42, lang === 'hu' ? 'Nap' : 'Day', '#edf6ff')}${pill(640, 202, 176, 42, lang === 'hu' ? 'Felfedezés' : 'Explore', '#f0eafa', '#cebaf1', '#5c45a0')}
  ${compactRows(170, 282, 620, [lang === 'hu' ? 'Aktív' : 'Active', lang === 'hu' ? 'Függő' : 'Pending', lang === 'hu' ? 'Meghívások' : 'Invitations', lang === 'hu' ? 'Saját' : 'Mine'], ['#fff', '#fff', '#fff', '#fff'])}`;
}

function eventCardVisual(lang) {
  return `<rect x="160" y="120" width="520" height="340" rx="22" fill="#fff" stroke="#c7dbed" stroke-width="3"/>
  <rect x="184" y="144" width="472" height="160" rx="16" fill="#c7d5bf"/><circle cx="226" cy="182" r="25" fill="#245c9c"/><text x="226" y="190" text-anchor="middle" font-family="Arial" font-size="18" font-weight="900" fill="#fff">MG</text>${pill(548, 164, 90, 42, '1 / 5', '#33445c', '#33445c', '#fff')}
  <text x="220" y="350" font-family="Arial" font-size="25" font-weight="900" fill="#1d3354">Phoenix Sunday Walk</text><text x="220" y="382" font-family="Arial" font-size="21" font-weight="850" fill="#52677f">Aug 29, 1:15 PM</text><text x="220" y="414" font-family="Arial" font-size="21" font-weight="850" fill="#52677f">Phoenix · 6.8 km</text>`;
}

function eventActionsVisual(lang) {
  return `${pill(170, 158, 140, 54, '1 / 5', '#33445c', '#33445c', '#fff')}
  ${menuRows(360, 150, 360, [lang === 'hu' ? 'Megtekintés' : 'View', lang === 'hu' ? 'Szerkesztés' : 'Edit', lang === 'hu' ? 'Publikálás' : 'Publish', lang === 'hu' ? 'Szervező' : 'Organizer', lang === 'hu' ? 'Megosztás' : 'Share'], ['#fff', '#fff', '#fff', '#fff', '#fff'])}`;
}

function eventJoinVisual(lang) {
  const steps = lang === 'hu' ? ['Meghívás', 'Fizetés / QR', 'Visszajelzés'] : ['Invitation', 'Checkout / QR', 'Feedback'];
  return `<g transform="translate(101 248)">${flowStep(0, steps[0], 170, 104)}${chevron(220, 52)}${flowStep(268, steps[1], 190, 104)}${chevron(508, 52)}${flowStep(556, steps[2], 190, 104)}</g>`;
}

function eventHostingVisual(lang) {
  return `${pill(172, 144, 250, 50, lang === 'hu' ? '+ Új esemény' : '+ New event', '#fff4e8', '#e5bf89', '#a56017')}
  ${compactRows(170, 226, 620, [lang === 'hu' ? 'Normál esemény' : 'Normal event', lang === 'hu' ? 'Bajnokság' : 'Tournament', lang === 'hu' ? 'Erőforrások' : 'Resources', 'Ticketing / QR'], ['#fff', '#fff', '#fff', '#fff'])}
  ${pill(278, 464, 520, 44, lang === 'hu' ? 'Auto meghívó · prioritási lista' : 'Auto inviter · priority list', '#e8f8ef', '#9ad5b0', '#17633b')}`;
}

function genericVisual(section, theme) {
  return `<rect x="220" y="160" width="520" height="230" rx="26" fill="#f8fcff" stroke="#c7dbed" stroke-width="3"/>
  <circle cx="480" cy="250" r="58" fill="${theme.main}" opacity=".14"/>${starIcon(480, 250, 34, theme.main)}
  ${lines(300, 338, 360, [1, .78, .88])}`;
}

function lines(x, y, w, widths) {
  return widths.map((ratio, index) => `<rect x="${x}" y="${y + index * 34}" width="${Math.round(w * ratio)}" height="13" rx="7" fill="#dbe8f5"/>`).join('');
}

function grid(x, y, w, h) {
  const parts = [`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#fff" opacity=".65" stroke="#c7dbed" stroke-width="2"/>`];
  for (let i = 1; i < 10; i++) parts.push(`<line x1="${x + i * w / 10}" y1="${y}" x2="${x + i * w / 10}" y2="${y + h}" stroke="#dfeaf5" stroke-width="1"/>`);
  for (let i = 1; i < 5; i++) parts.push(`<line x1="${x}" y1="${y + i * h / 5}" x2="${x + w}" y2="${y + i * h / 5}" stroke="#dfeaf5" stroke-width="1"/>`);
  return parts.join('');
}

function edge(x1, y1, x2, y2, color, width) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" opacity=".86"/>`;
}

function node(x, y, text, fill = '#fff', r = 22) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#9eb9d4" stroke-width="3"/><text x="${x}" y="${y + 7}" text-anchor="middle" font-family="Arial" font-size="18" font-weight="900" fill="#245c9c">${esc(text)}</text>`;
}

function smallText(x, y, text) {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial" font-size="18" font-weight="900" fill="#263e5c" stroke="#fff" stroke-width="5" paint-order="stroke">${text}</text>`;
}

function menuRows(x, y, w, values, fills) {
  const h = 56;
  return values.map((value, index) => {
    const yy = y + index * (h + 8);
    return `<rect x="${x}" y="${yy}" width="${w}" height="${h}" rx="13" fill="${fills[index] ?? '#fff'}" stroke="#c7d9ef" stroke-width="3"/><text x="${x + 24}" y="${yy + 37}" font-family="Arial" font-size="29" font-weight="900" fill="#1f4778">${esc(value)}</text>`;
  }).join('');
}

function compactRows(x, y, w, values, fills) {
  const h = 52;
  return values.map((value, index) => {
    const yy = y + index * (h + 8);
    return `<rect x="${x}" y="${yy}" width="${w}" height="${h}" rx="13" fill="${fills[index] ?? '#fff'}" stroke="#c7d9ef" stroke-width="3"/><text x="${x + 24}" y="${yy + 35}" font-family="Arial" font-size="28" font-weight="900" fill="#1f4778">${esc(value)}</text>`;
  }).join('');
}

function field(x, y, label, value) {
  return `<rect x="${x}" y="${y}" width="150" height="74" rx="12" fill="#fff" stroke="#c7d9ef" stroke-width="3"/><text x="${x + 16}" y="${y + 26}" font-family="Arial" font-size="17" font-weight="800" fill="#61728f">${esc(label)}</text><text x="${x + 16}" y="${y + 55}" font-family="Arial" font-size="19" font-weight="900" fill="#1d3354">${esc(value)}</text>`;
}

function requestRow(x, y, name, action) {
  return `<rect x="${x}" y="${y}" width="560" height="62" rx="16" fill="#fff" stroke="#d6e2f0" stroke-width="3"/><circle cx="${x + 36}" cy="${y + 31}" r="23" fill="#4f7fe8"/><text x="${x + 76}" y="${y + 40}" font-family="Arial" font-size="22" font-weight="900" fill="#1d3354">${esc(name)}</text>${pill(x + 385, y + 11, 140, 40, action, '#e8f8ef', '#9ad5b0', '#17633b')}`;
}

function memberRow(x, y, initials, name, role) {
  return `<rect x="${x}" y="${y}" width="560" height="62" rx="16" fill="#fff" stroke="#d6e2f0" stroke-width="3"/><circle cx="${x + 36}" cy="${y + 31}" r="23" fill="#4f7fe8"/><text x="${x + 36}" y="${y + 39}" text-anchor="middle" font-family="Arial" font-size="18" font-weight="900" fill="#fff">${esc(initials)}</text><text x="${x + 76}" y="${y + 30}" font-family="Arial" font-size="22" font-weight="900" fill="#1d3354">${esc(name)}</text><text x="${x + 76}" y="${y + 54}" font-family="Arial" font-size="18" font-weight="850" fill="#61728f">${esc(role)}</text>`;
}

function flowStep(x, text, w = 190, h = 112) {
  const centerX = x + w / 2;
  return `<rect x="${x}" y="0" width="${w}" height="${h}" rx="20" fill="#fff" stroke="#c7d9ef" stroke-width="3"/><rect x="${centerX - 16}" y="22" width="32" height="32" rx="7" transform="rotate(45 ${centerX} 38)" fill="#245c9c"/><text x="${centerX}" y="${h - 26}" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="19" font-weight="900" fill="#1d3354">${esc(text)}</text>`;
}

function writeSvg(lang, context, section) {
  const svg = svgFor(lang, context, section);
  for (const root of [frontendRoot, serverRoot]) {
    const dir = join(root, lang, context);
    mkdirSync(dir, { recursive: true });
    const svgPath = join(dir, `${section}.svg`);
    writeFileSync(svgPath, svg);
  }
}

for (const lang of ['en', 'hu']) {
  for (const [context, sections] of Object.entries(contexts)) {
    for (const section of sections) {
      writeSvg(lang, context, section);
    }
  }
}
