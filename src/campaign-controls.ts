import { buyerSite, districtProjects, isOpenContract, mills, biomassSites, waterSites, waterPumps, storageSite } from './campaign';
import type { Campaign, Site } from './campaign';
import { DISTRICTS, TOTAL, facilities, tools, goods } from './catalog';
import type { Good, Stack, Tool } from './catalog';
import { distance, districtAt } from './land';
import type { Point } from './land';
import { quests } from './quests';
import type { QuestId } from './quests';
import type { RoomPermission } from './room-permissions';

export const campaignPermissions = {
  equip:'research', service:'research', upgrade:'research', prototype:'research', recover:'vehicles',
  permit:'build', project:'build', cleanup:'build', cleanupMany:'build',
  claim:'trade', contract:'trade', commission:'trade', deliver:'trade', sell:'trade',
  policy:'stations', start:'stations', staff:'stations', enlarge:'stations', scrub:'stations',
  priority:'stations', sow:'stations', fertilize:'stations', intensive:'stations', manual:'stations', crank:'stations',
  layout:'stations', sortHigh:'stations', fuel:'stations', pump:'stations', waterMode:'stations',
  waterRate:'stations', fireMode:'stations', output:'stations', feed:'stations', connect:'stations',
  disconnect:'stations', clear:'stations', crane:'stations', schedule:'stations', freightPlan:'stations',
  assignVehicle:'stations', alternate:'stations', winch:'stations', order:'stations', shift:'stations',
  hauler:'stations', haulerAlternate:'stations',
} as const satisfies Record<string,RoomPermission>;
export type CampaignCommand=keyof typeof campaignPermissions;
export type CommandArgs=(string|number|boolean|null)[];
const integer=(value:unknown,limit:number):value is number=>Number.isInteger(value)&&Number(value)>=0&&Number(value)<limit;
const key=(obj:object,value:unknown):value is string=>typeof value==='string'&&Object.hasOwn(obj,value);
export function lotKey(lots:Stack[], lot:Stack) {
  return [lots.indexOf(lot),JSON.stringify(lot)] as const;
}

// Both the local menus and Photon requests use the same authoritative operations.
export function campaignControl(g:Campaign, command:CampaignCommand, args:unknown[], at:Point, vehicleOccupied:(id:string)=>boolean=()=>false, logHeld:(id:number)=>boolean=()=>false):boolean {
  const [a,b,c,d]=args;
  switch(command){
    case 'equip': return key(tools,a)&&Boolean(g.acquireTool(a as Tool));
    case 'service': return Boolean(g.retool());
    case 'upgrade': return typeof a==='string'&&Boolean(g.buyUpgrade(a));
    case 'prototype': return (a==='edge'||a==='motor')&&Boolean(g.develop(a));
    case 'recover': {
      const v=g.rides.find(v=>v.id===a);
      return Boolean(v&&!vehicleOccupied(v.id)&&(!v.hitch||!vehicleOccupied(v.hitch))&&!g.rides.some(r=>r.hitch===v.id&&vehicleOccupied(r.id))&&g.recoverRide(v));
    }
    case 'permit': return integer(a,DISTRICTS**2)&&Boolean(g.buyDistrict(a));
    case 'project': return integer(a,DISTRICTS**2)&&key(districtProjects,b)&&Boolean(g.startProject(a,b as keyof typeof districtProjects));
    case 'cleanup': return integer(a,TOTAL)&&Boolean(g.dispatchCleanup(a));
    case 'cleanupMany': {
      if(!g.mods.lastPixel||!args.length||args.length>16||!args.every(i=>integer(i,TOTAL)))return false;
      let queued=false;
      for(const i of new Set(args))if(g.dispatchCleanup(i))queued=true;
      return queued;
    }
    case 'claim': return key(quests,a)&&Boolean(g.claimQuest(a as QuestId));
    case 'policy':
      if(!g.mods.opsPolicy||(a!=='manual'&&a!=='revenue'&&a!=='land'))return false;
      g.policy=a;
      return true;
  }
  const s=g.sites.find(s=>s.id===a);
  if(!s||distance(s,at)>4.2)return false;
  if(campaignPermissions[command]==='trade'&&!buyerSite(s.kind))return false;
  const target=g.sites.find(s=>s.id===b);
  const vehicle=g.rides.find(v=>v.id===b);
  switch(command){
    case 'contract':
      if(!key(goods,b)||typeof c!=='boolean')return false;
      if(d==='quick')return b==='timber'&&g.mods.shortOrders&&Boolean(g.acceptContract(b as Good,c,d));
      if(d==='supply')return b==='boards'&&g.mods.supplyDeals&&Boolean(g.acceptContract(b as Good,c,d));
      if(d==='export')return b==='furniture'&&g.mods.exportMarket&&Boolean(g.acceptContract(b as Good,c,d));
      if(d!==undefined||c&&(b!=='compute'||!g.mods.denseCompute))return false;
      if(!['boards','dry','crates','paper','compute'].includes(b)
        &&!(b==='timber'&&g.mods.ashContracts)
        &&!(['briquettes','pellets'].includes(b)&&g.mods.bioOrders)
        &&!(b==='packed'&&g.mods.exportOrders)
        &&!(['finished','treated'].includes(b)&&g.mods.certified))return false;
      return Boolean(g.acceptContract(b as Good,c));
    case 'commission': return g.mods.commissions&&typeof b==='string'&&['finishedCabinet','floors','modular'].includes(b)&&typeof c==='boolean'&&Boolean(g.acceptCommission(b as Good,c));
    case 'deliver': {
      const deal=typeof b==='number'&&typeof c==='string'&&g.contracts.find(d=>d.deadline===b&&d.good===c&&isOpenContract(d,g.clock)&&JSON.stringify(d)===args[3]);
      return Boolean(deal&&g.fulfill(deal));
    }
    case 'sell': case 'output': case 'feed': {
      const lots=command==='output'?s.output:g.stock;
      const lot=integer(b,lots.length)?lots[b]:undefined;
      if(!lot||c!==JSON.stringify(lot)||typeof d!=='boolean')return false;
      const amount=d?lot.quantity:1;
      return command==='sell'?g.sellInventory(lot.good,amount,lot,s):g.transfer(s,lot.good,amount,command==='output',lot);
    }
    case 'start': s.on=!s.on;return true;
    case 'staff': return Boolean(g.staff(s));
    case 'enlarge': return Boolean(g.enlarge(s));
    case 'scrub':
      if(!g.mods.emissions||facilities[s.kind].effect!=='thermal')return false;
      s.scrubbers=!s.scrubbers;return true;
    case 'priority':
      if(!g.mods.priority)return false;
      s.priority=!s.priority;return true;
    case 'sow': return Boolean(g.sow(s));
    case 'fertilize': return Boolean(g.fertilize(s));
    case 'intensive':
      if(!g.mods.override||!['crop','megaFarm','pasture'].includes(s.kind))return false;
      s.intensive=!s.intensive;return true;
    case 'manual':
      if(s.kind!=='bench'||!g.mods.benchCrank)return false;
      s.manual=!s.manual;return true;
    case 'crank': return Boolean(g.crankBench(s));
    case 'layout':
      if(!g.mods.cutPatterns||!mills.includes(s.kind))return false;
      s.layout=s.layout==='volume'?'quality':s.layout==='quality'?undefined:'volume';return true;
    case 'sortHigh':
      if(!g.mods.sortingCamera&&!g.mods.roboticSort)return false;
      s.sortHigh=!s.sortHigh;return true;
    case 'fuel':
      if(g.cash<25||s.fuel>=100||!facilities[s.kind].supply||['solar','wind',...biomassSites].includes(s.kind))return false;
      g.finance(-25,'Generator fuel');s.fuel=100;return true;
    case 'pump': return Boolean(g.pumpByHand(s));
    case 'waterMode':
      if(!g.mods.diversion||!waterSites.includes(s.kind))return false;
      s.waterMode=s.waterMode==='farm'?'industry':s.waterMode==='industry'?'all':'farm';return true;
    case 'waterRate':
      if(!g.mods.waterBoard||!waterPumps.includes(s.kind))return false;
      s.waterRate=s.waterRate==='conserve'?'deplete':s.waterRate==='deplete'?'normal':'conserve';return true;
    case 'fireMode':
      if(s.kind!=='fire'||!g.mods.carbon)return false;
      s.mode=s.mode==='charcoal'?'sell':'charcoal';return true;
    case 'connect': return Boolean(target&&g.connect(s,target));
    case 'disconnect':
      if(typeof b!=='boolean'||(!b&&s.shipment))return false;
      g.disconnectRoute(s,b);return true;
    case 'clear':
      if(s.kind!=='clearingCrew'||!integer(b,TOTAL)||!g.districts.has(districtAt(b)))return false;
      s.clearingTarget=b;return true;
    case 'crane': {
      const log=typeof c==='number'&&g.logs.get(c);
      return Boolean(vehicle&&log&&!vehicleOccupied(vehicle.id)&&!logHeld(log.id)&&g.loadByCrane(s,log,vehicle));
    }
    case 'schedule': return Boolean(vehicle&&!vehicleOccupied(vehicle.id)&&g.scheduleService(s,vehicle));
    case 'freightPlan':
      if(s.kind!=='intermodal'||s.shipment)return false;
      s.freightPlan=s.freightPlan==='road'?'rail':'road';s.link=undefined;return true;
    case 'assignVehicle':
      if(s.kind!=='autoGarage'||s.shipment||!vehicle||vehicleOccupied(vehicle.id))return false;
      if(s.dedicatedRide===vehicle.id){s.dedicatedRide=undefined;return true;}
      return Boolean(g.assignDriverless(s,vehicle));
    case 'alternate': return Boolean(target&&g.mods.sortGate&&['sortGate','robotSorter'].includes(s.kind)&&key(goods,c)&&g.connectAlternate(s,target,c as Good));
    case 'winch': {
      if(b===null)return Boolean(s.winch&&g.assignWinch(s));
      const log=typeof b==='number'&&g.logs.get(b);
      return Boolean(log&&!logHeld(log.id)&&g.assignWinch(s,log));
    }
    case 'order':
      if(!g.mods.jobBoards||!crewStation(s,g)||(b!=='harvest'&&b!=='haul'&&b!=='clear'))return false;
      s.order=b;return true;
    case 'shift':
      if(!g.mods.jobBoards||!g.mods.scheduling||!crewStation(s,g))return false;
      s.shift=s.shift==='day'?'continuous':'day';return true;
    case 'hauler':
      if(!target||!crewStation(s,g)||!g.assignHauler(s,target))return false;
      s.order='haul';return true;
    case 'haulerAlternate':
      if(!target||!g.mods.fleetController||!crewStation(s,g)||!s.haul||target===s||distance(s,target)>110)return false;
      s.haul.alternate=target.id;return true;
    default: return false;
  }
}

function crewStation(site:Site,game:Campaign) {
  return ['forestry','helperPost','crewDepot'].includes(site.kind)||(game.mods.yardmaster&&storageSite(site.kind));
}
