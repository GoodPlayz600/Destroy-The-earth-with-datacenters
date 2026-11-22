(() => {
  let active;
  let generation = 0;
  const notify = value => window.clearcutUnity?.SendMessage("Field operator", "OnPhotonMessage", JSON.stringify(value));

  function close() {
    generation++;
    const previous = active;
    active = undefined;
    previous?.dispose();
  }

  async function open(appId, region, roomCode, host) {
    close();
    const attempt = generation;
    const send = value => {
      if (attempt === generation) notify(value);
    };
    let timer;
    try {
      const { createRealtimeClient } = await import("./PhotonVendor/dist/index.js");
      if (attempt !== generation) return;
      const client = await createRealtimeClient({
        appId, appVersion: "clearcut-unity-opening-3", protocol: "wss", regionSelection: "select",
        useAlternativePorts: true, disconnectTimeoutMs: 15000,
        wasm: { url: new URL("./PhotonVendor/dist/native/realtimecore.wasm", window.location.href).href }
      });
      if (attempt !== generation) {
        client.dispose();
        return;
      }
      active = client;
      const join = async () => {
        const available = client.availableRegions();
        const connected = client.connect();
        connected.catch(() => {});
        const regions = await Promise.race([available, connected.then(() => available)]);
        if (!regions.some(choice => choice.code === region)) throw Error("Photon region unavailable for this app.");
        await client.selectRegion(region);
        await connected;
        const roomName = "clearcut-unity-" + roomCode;
        return host
          ? client.createRoom(roomName, { isVisible: false, maxPlayers: 4, emptyRoomTtlMs: 0, playerTtlMs: 0 })
          : client.joinRoom(roomName);
      };
      const room = await Promise.race([join(), new Promise((_, reject) => {
        timer = window.setTimeout(() => reject(Error("Photon connection timed out.")), 22000);
      })]);
      if (attempt !== generation) return;
      client.onEventRange(40, 44, ({code, senderNumber, data}) => {
        if (typeof data === "string" && data.length <= 55000)
          send({ kind: "event", code, actor: senderNumber, payload: data });
      });
      client.on("playerLeft", ({playerNumber}) => send({kind: "left", actor: playerNumber}));
      client.on("masterClientChanged", () => send({kind: "closed", payload: "The original host disconnected."}));
      client.on("disconnected", () => send({kind: "closed", payload: "Disconnected from Photon."}));
      send({kind: "joined", actor: client.localPlayer.number, master: room.masterClientNumber});
    } catch (error) {
      if (attempt === generation) {
        const message = String(error.message || error).split(appId).join("[App ID]");
        send({kind: "error", payload: message});
        close();
      }
    } finally {
      window.clearTimeout(timer);
    }
  }

  window.clearcutPhoton = {
    open, close,
    send(code, data, target) {
      if (active?.isInRoom)
        active.sendEvent(code, data, {reliable: code !== 40, targetPlayers: target > 0 ? [target] : undefined});
    }
  };
  window.addEventListener("pagehide", close);
})();
