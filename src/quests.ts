import type { Campaign } from './campaign';
import { TOTAL } from './catalog';

type Quest = {
  title:string;
  detail:string;
  target:number;
  reward:number;
  progress:(game:Campaign)=>number;
};
export const quests = {
  firstSale:{title:'First shift',detail:'Deliver a physical trunk to the Ash Exchange and wait for payment.',target:1,reward:25,progress:g=>g.stats.fire},
  research:{title:'Make work easier',detail:'Install an upgrade that improves your operation.',target:1,reward:35,progress:g=>g.ownedUpgrades.size},
  cutting:{title:'Bring something sharper',detail:'Own at least two cutting tools.',target:2,reward:70,progress:g=>g.ownedTools.size},
  boards:{title:'Value added',detail:'Produce four units at the sawbench or a powered mill.',target:4,reward:100,progress:g=>g.stats.produced},
  market:{title:'Timber account',detail:'Sell six units through the Timber Exchange.',target:6,reward:150,progress:g=>g.stats.sold},
  fleet:{title:'Work on wheels',detail:'Commission a vehicle for the logging operation.',target:1,reward:185,progress:g=>g.rides.length},
  order:{title:'Freight commitment',detail:'Fulfill a timed contract at the Timber Exchange.',target:1,reward:225,progress:g=>g.contracts.filter(c=>c.done).length},
  grid:{title:'Power on',detail:'Install a generator or renewable power source.',target:1,reward:340,progress:g=>g.sites.filter(s=>['generator','portable','solar','wind','biopower','thermal','gridPlant'].includes(s.kind)).length},
  freight:{title:'District supply chain',detail:'Assign three outgoing factory or depot routes.',target:3,reward:530,progress:g=>g.sites.filter(s=>Boolean(s.link)).length},
  firstDry:{title:'First hundred cells',detail:'Reach 100 stable desert cells across the map.',target:100,reward:950,progress:g=>g.desertCount},
  permits:{title:'Industrial district office',detail:'Hold permits for four districts.',target:4,reward:1550,progress:g=>g.districts.size},
  regional:{title:'One district down',detail:'Finish a commissioned conversion project.',target:1,reward:2350,progress:g=>g.projects.filter(p=>p.complete).length},
  final:{title:'The last jungle',detail:'Convert every eligible cell into stable desert.',target:TOTAL,reward:0,progress:g=>g.desertCount},
} satisfies Record<string,Quest>;
export type QuestId=keyof typeof quests;
