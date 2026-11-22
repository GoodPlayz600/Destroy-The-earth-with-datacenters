mergeInto(LibraryManager.library, {
  ClearcutPhotonOpen: function(appId, region, room, host) {
    window.clearcutPhoton.open(UTF8ToString(appId), UTF8ToString(region), UTF8ToString(room), Boolean(host));
  },
  ClearcutPhotonSend: function(code, payload, target) {
    window.clearcutPhoton.send(code, UTF8ToString(payload), target);
  },
  ClearcutPhotonClose: function() {
    window.clearcutPhoton.close();
  }
});
