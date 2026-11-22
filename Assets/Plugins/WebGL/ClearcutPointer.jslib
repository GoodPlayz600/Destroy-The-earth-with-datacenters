mergeInto(LibraryManager.library, {
  ClearcutPointerArm: function(enabled) {
    window.clearcutPointer.arm(Boolean(enabled));
  },
  ClearcutPointerLocked: function() {
    return window.clearcutPointer.locked() ? 1 : 0;
  }
});
