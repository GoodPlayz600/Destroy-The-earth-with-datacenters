(() => {
  const canvas = document.getElementById("jungle");
  let armed = false;
  let pending = false;

  const locked = () => document.pointerLockElement === canvas;
  const denied = () => {
    if (!pending) return;
    pending = false;
    armed = false;
    window.clearcutUnity?.SendMessage("Field operator", "OnWebPointerLockDenied");
  };

  document.addEventListener("pointerlockerror", denied);
  document.addEventListener("pointerlockchange", () => {
    pending = false;
    if (!armed && locked()) document.exitPointerLock();
  });

  canvas.addEventListener("pointerdown", event => {
    canvas.focus({ preventScroll: true });
    if (!armed || pending || locked() || event.button !== 0) return;
    pending = true;
    if (typeof canvas.requestPointerLock !== "function" || !document.hasFocus()) {
      denied();
      return;
    }
    try {
      canvas.requestPointerLock()?.catch(denied);
    } catch {
      denied();
    }
  });
  canvas.addEventListener("contextmenu", event => event.preventDefault());

  window.clearcutPointer = {
    locked,
    arm(enabled) {
      armed = enabled;
      if (!enabled && locked()) document.exitPointerLock();
    }
  };
})();
