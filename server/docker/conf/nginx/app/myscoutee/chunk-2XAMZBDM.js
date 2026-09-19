// src/app/shared/ui/scheduler/after-paint.ts
function scheduleAfterPaint(work) {
  let cancelled = false;
  let frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(() => {
      if (!cancelled)
        work();
    });
  });
  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
  };
}

export {
  scheduleAfterPaint
};
//# sourceMappingURL=chunk-2XAMZBDM.js.map
