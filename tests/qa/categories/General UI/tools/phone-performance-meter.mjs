// Observe the already prepared Android Chrome page. No navigation or app-state edits.
// Install: node <this file>; collect: node <this file> --collect [--stop]
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../../../myscoutee-frontend/package.json', import.meta.url));
const browser = await require('playwright').chromium.connectOverCDP('http://127.0.0.1:36087');
try {
  const page = browser.contexts().flatMap(context => context.pages())
    .find(page => page.url().startsWith('http://localhost:8080/'));
  if (!page) throw new Error('The retained phone page is unavailable; do not launch another session.');
  if (process.argv.includes('--collect')) {
    const result = await page.evaluate(stop => {
      const meter = window.__qaMobilePerformance;
      if (!meter) return null;
      const result = meter.snapshot();
      if (stop) meter.stop();
      return result;
    }, process.argv.includes('--stop'));
    if (!result) throw new Error('Meter is not installed on this page (a reload removes it).');
    fs.writeFileSync('/tmp/myscoutee-phone-performance.json', JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify({ file: '/tmp/myscoutee-phone-performance.json',
      switches: result.switches.slice(-6), drags: result.drags.slice(-4),
      longTaskCount: result.longTasks.length }));
  } else {
    await page.evaluate(showHud => {
      window.__qaMobilePerformance?.stop();
      const canvas = document.createElement('canvas');
      canvas.id = 'qa-mobile-performance-meter';
      canvas.setAttribute('aria-label', 'Temporary QA performance meter');
      let hudVisible = showHud;
      canvas.style.cssText = 'position:fixed;left:4px;top:4px;width:224px;height:68px;z-index:2147483647;pointer-events:none;border-radius:6px;contain:strict;';
      const scale = devicePixelRatio || 1;
      canvas.width = 224 * scale;
      canvas.height = 68 * scale;
      canvas.hidden = !hudVisible;
      document.body.append(canvas);
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      const startedAt = new Date().toISOString();
      const frames = [], inputs = [], tasks = [], switches = [], drags = [];
      let running = true, raf = 0, previousFrame = 0, lastDraw = 0;
      let pendingInput = null, switching = null, dragging = null;
      const append = (array, value, limit = 300) => {
        array.push(value);
        if (array.length > limit) array.splice(0, array.length - limit);
      };
      const percentile = (values, fraction) => {
        if (!values.length) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
      };
      const nowStamp = event => event.timeStamp > performance.timeOrigin
        ? event.timeStamp - performance.timeOrigin : event.timeStamp;
      const input = event => {
        if (!event.isTrusted || document.hidden) return;
        const time = performance.now(), stamp = nowStamp(event);
        if (stamp < 0 || stamp > time || time - stamp > 10000) return;
        pendingInput = { at: time, eventAt: stamp, queueMs: time - stamp, type: event.type };
        if (dragging && (event.type === 'pointermove' || event.type === 'touchmove')) {
          dragging.moves++;
          dragging.lastMoveAt = time;
          dragging.maxQueueMs = Math.max(dragging.maxQueueMs, time - stamp);
        }
      };
      const down = event => {
        input(event);
        if (!event.target.closest?.('[data-guide-field="pair-resize"]')) return;
        dragging = { started: performance.now(), moves: 0, frames: [], maxQueueMs: 0 };
      };
      const up = () => {
        if (!dragging) return;
        append(drags, { durationMs: performance.now() - dragging.started, moves: dragging.moves,
          frameP95Ms: percentile(dragging.frames, .95), maxFrameMs: Math.max(0, ...dragging.frames),
          maxQueueMs: dragging.maxQueueMs }, 40);
        dragging = null;
      };
      const click = event => {
        input(event);
        if (!event.target.closest?.('app-activities-popup [data-guide-field="fullscreen"]')) return;
        const root = document.querySelector('app-activities-popup');
        switching = { at: performance.now(), direction: root.querySelector('.smart-list__fullscreen-card--active')
          ? 'list' : 'fullscreen', cardMs: null, affinityMs: null, firstPaintUpperBoundMs: null, readyFrame: null };
      };
      const listeners = [ ['pointerdown', down], ['pointermove', input], ['touchmove', input],
        ['pointerup', up], ['pointercancel', up], ['click', click] ];
      for (const [type, listener] of listeners) window.addEventListener(type, listener, { capture: true, passive: true });
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) append(tasks, { at: entry.startTime, durationMs: entry.duration }, 150);
      });
      observer.observe({ type: 'longtask' });
      let frameNumber = 0;
      const draw = now => {
        const recentFrames = frames.filter(item => now - item.at < 3000).map(item => item.ms);
        const recentInputs = inputs.filter(item => now - item.at < 3000);
        const last = switches.at(-1);
        ctx.clearRect(0, 0, 224, 68);
        ctx.fillStyle = 'rgba(15,23,42,.9)'; ctx.fillRect(0, 0, 224, 68);
        ctx.font = '11px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('QA MERO — csak megfigyel', 7, 13);
        ctx.fillText(`Frame p95/max: ${percentile(recentFrames,.95).toFixed(0)}/${Math.max(0,...recentFrames).toFixed(0)} ms`, 7, 29);
        ctx.fillText(`Input sor/frame: ${percentile(recentInputs.map(i=>i.queueMs),.95).toFixed(0)}/${percentile(recentInputs.map(i=>i.frameMs),.95).toFixed(0)} ms`, 7, 45);
        ctx.fillText(last ? `${last.direction}: ${last.firstPaintUpperBoundMs.toFixed(0)} ms | sav +${last.affinityMs === null ? '-' : Math.max(0,last.affinityMs-last.cardMs).toFixed(0)}` : 'Valts nezetet, vagy huzd a savot', 7, 61);
      };
      const frame = time => {
        if (!running) return;
        frameNumber++;
        if (!document.hidden && previousFrame) {
          const ms = time - previousFrame;
          append(frames, { at: time, ms });
          if (dragging?.moves) append(dragging.frames, ms);
        }
        previousFrame = document.hidden ? 0 : time;
        const now = performance.now();
        if (pendingInput) {
          append(inputs, { ...pendingInput, frameMs: now - pendingInput.eventAt });
          pendingInput = null;
        }
        if (switching) {
          const root = document.querySelector('app-activities-popup');
          const fullscreen = !!root?.querySelector('.smart-list__fullscreen-card--active');
          if (fullscreen === (switching.direction === 'fullscreen')) {
            switching.cardMs ??= now - switching.at;
            const rate = root?.querySelector('.app-menu-outlet--fixed .rate');
            const panel = rate?.closest('.app-menu__panel');
            if (panel && getComputedStyle(panel).opacity === '1') switching.affinityMs ??= now - switching.at;
            switching.readyFrame ??= frameNumber;
            if (frameNumber > switching.readyFrame && (switching.direction === 'list' || switching.affinityMs !== null)) {
              switching.firstPaintUpperBoundMs = now - switching.at;
              append(switches, { ...switching }, 40);
              switching = null;
            }
          }
          if (switching && now - switching.at > 5000) switching = null;
        }
        if (hudVisible && now - lastDraw > 200) { lastDraw = now; draw(now); }
        raf = requestAnimationFrame(frame);
      };
      window.__qaMobilePerformance = {
        setHudVisible: visible => { hudVisible = visible; canvas.hidden = !visible; },
        snapshot: () => ({ startedAt, capturedAt: new Date().toISOString(), viewport: { width: innerWidth, height: innerHeight, dpr: scale },
          build: `running dev build; no CPU throttling; ${hudVisible ? 'temporary 5Hz canvas HUD' : 'passive sampler, HUD disabled'}`,
          note: 'RAF timing is an upper-bound proxy for paint, not hardware display latency. No app state is modified.',
          switches, drags, frames, inputs, longTasks: tasks }),
        stop: () => {
          running = false; cancelAnimationFrame(raf); observer.disconnect();
          for (const [type, listener] of listeners) window.removeEventListener(type, listener, true);
          canvas.remove(); delete window.__qaMobilePerformance;
        }
      };
      raf = requestAnimationFrame(frame);
    }, !process.argv.includes('--quiet'));
    console.log(process.argv.includes('--quiet') ? 'Passive sampler installed without canvas updates or CPU profiling.' : 'Temporary passive meter installed on the retained phone page. No navigation performed.');
  }
} finally { await browser.close(); }
