import type { Save } from './campaign';
import { validateSave } from './storage';

export const campaignModes = { standard: 'Standard', noCompute: 'No compute', leanPower: 'Lean grid' } as const;
export type CampaignMode = keyof typeof campaignModes;
type CloudBackup = { revision: string; savedAt: string; bytes: number };
export type Account = { signedIn: boolean; cloud: CloudBackup | null; entries: { mode: CampaignMode; name: string }[] };
export type Rank = { name: string; cells: number; earned: number; completion: number | null; yours: 0 | 1 };

async function request(path: string, options?: RequestInit): Promise<Response> {
  const response = await fetch('./api/game/' + path, {
    cache: 'no-store',
    signal: AbortSignal.timeout(45000),
    ...options,
  });
  if (!response.headers.get('Content-Type')?.includes('application/json')) {
    if (response.status === 401 || response.redirected) throw Error('Sign in again to use online services.');
    throw Error('Online services are unavailable. Your local campaign is still available.');
  }
  if (!response.ok) {
    const { error } = await response.json();
    throw Error(error || 'Online services are temporarily unavailable.');
  }
  return response;
}
export async function account(): Promise<Account> {
  return (await request('account')).json();
}
export async function leaderboard(mode: CampaignMode): Promise<{ entries: Rank[]; totalCells: number }> {
  return (await request('leaderboard?mode=' + mode)).json();
}
export async function uploadBackup(save: Save, revision: string) {
  const response = await request('save', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Save-Revision': revision, 'X-Clearcut-Action': '1' },
    body: JSON.stringify(save),
  });
  return response.json() as Promise<{ cloud: CloudBackup }>;
}
export async function downloadBackup(revision: string) {
  const response = await request('save');
  if (response.headers.get('X-Save-Revision') !== revision) {
    throw Error('The cloud backup changed. Refresh the account to review the new version.');
  }
  return validateSave(await response.json());
}
export async function publish(name: string, revision: string) {
  const response = await request('leaderboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Clearcut-Action': '1', 'X-Save-Revision': revision },
    body: JSON.stringify({ name }),
  });
  return response.json() as Promise<{ mode: CampaignMode }>;
}
export async function removeEntry(mode: CampaignMode) {
  await request('leaderboard?mode=' + mode, { method: 'DELETE', headers: { 'X-Clearcut-Action': '1' } });
}
