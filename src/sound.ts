export class Sound {
  private context?: AudioContext;
  private output?: GainNode;
  private ambience?: GainNode;
  private noise?: AudioBuffer;
  private lastBird=0;

  start(scale:number) {
    if(!this.context) {
      const context=new AudioContext();
      this.context=context;
      this.output=context.createGain();
      this.output.connect(context.destination);
      this.noise=context.createBuffer(1,context.sampleRate*2,context.sampleRate);
      const samples=this.noise.getChannelData(0);
      for(let i=0;i<samples.length;i++) samples[i]=Math.random()*2-1;
      const source=context.createBufferSource();
      source.buffer=this.noise;
      source.loop=true;
      const filter=context.createBiquadFilter();
      filter.type='lowpass'; filter.frequency.value=380;
      this.ambience=context.createGain();
      this.ambience.gain.value=.02;
      source.connect(filter).connect(this.ambience).connect(this.output);
      source.start();
    }
    void this.context.resume();
    this.volume(scale);
  }

  volume(n:number) { if(this.output) this.output.gain.value=n*.58; }
  ambient(time:number, rain:number, forest:boolean, motor:boolean, active:boolean) {
    if(!this.ambience || !this.context) return;
    this.ambience.gain.setTargetAtTime(active ? .048+rain*.075+(motor?.075:0) : 0,this.context.currentTime,.24);
    if(active && forest && time>this.lastBird) {
      this.lastBird=time+5+Math.random()*8;
      this.tone(1060+Math.random()*370,.12,.017,'sine',.76);
      this.tone(890+Math.random()*260,.14,.012,'sine',1.38,.14);
    }
  }

  private tone(freq:number,time:number,peak:number,type:OscillatorType='sine',end=.60,delay=0) {
    if(!this.context || !this.output) return;
    const {currentTime:now}=this.context, start=now+delay;
    const osc=this.context.createOscillator(), gain=this.context.createGain();
    osc.type=type;
    osc.frequency.setValueAtTime(freq,start);
    osc.frequency.exponentialRampToValueAtTime(freq*end,start+time);
    gain.gain.setValueAtTime(.0001,start);
    gain.gain.exponentialRampToValueAtTime(peak,start+.02);
    gain.gain.exponentialRampToValueAtTime(.0001,start+time);
    osc.connect(gain).connect(this.output);
    osc.start(start); osc.stop(start+time);
  }
  private rustle(duration:number,hz:number,peak:number) {
    if(!this.context||!this.output||!this.noise) return;
    const source=this.context.createBufferSource();
    source.buffer=this.noise;
    const gain=this.context.createGain(), filter=this.context.createBiquadFilter(), now=this.context.currentTime;
    filter.type='bandpass'; filter.frequency.value=hz;
    gain.gain.setValueAtTime(peak,now); gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    source.connect(filter).connect(gain).connect(this.output);
    source.start(now,Math.random()); source.stop(now+duration);
  }
  swing(knife:boolean,hit:boolean) { this.rustle(hit?.17:.09,hit?(knife?2400:690):520,hit?.26:.12); if(hit) this.tone(knife?220:97,.15,.23,'triangle'); }
  fall() { this.rustle(.45,670,.4); this.tone(84,.51,.28,'triangle',.43); }
  step(heavy=false) { this.rustle(.1,heavy?180:360,heavy?.24:.12); }
  cash() { this.tone(523,.20,.21,'sine',1.01); this.tone(784,.32,.17,'triangle',1.04,.095); }
  select() { this.tone(255,.09,.07,'sine',1.4); }
  finish() { for(const [i,f] of [220,293,349,440,587,698].entries()) this.tone(f,.85,.14,'triangle',1.01,i*.13); }
}
