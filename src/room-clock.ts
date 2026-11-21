// A room has to service transport and advance its authoritative simulation even
// when the browser stops animation frames for the host's background tab.
export function startRoomClock(tick:()=>void) {
  if(typeof Worker!=='undefined'){
    try {
      const worker=new Worker(new URL('./room-clock.worker.ts',import.meta.url),{type:'module'});
      let fallback:number|undefined;
      worker.onmessage=tick;
      worker.onerror=()=>{
        worker.terminate();
        fallback??=window.setInterval(tick,50);
      };
      return ()=>{
        worker.terminate();
        if(fallback!==undefined)window.clearInterval(fallback);
      };
    } catch { /* Fall back when workers are unavailable. */ }
  }
  const timer=window.setInterval(tick,50);
  return ()=>window.clearInterval(timer);
}
