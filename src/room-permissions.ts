export const roomPermissions = {
  field: 'Harvest & haul',
  vehicles: 'Vehicles & cargo',
  build: 'Construction & land',
  research: 'Research & equipment',
  stations: 'Stations & logistics',
  trade: 'Trade & objectives',
} as const;
export type RoomPermission = keyof typeof roomPermissions;
export const permissionKeys = Object.keys(roomPermissions) as RoomPermission[];
export const allPermissions = (1 << permissionKeys.length) - 1;
export function hasPermission(mask:number, key:RoomPermission) {
  return (mask & (1 << permissionKeys.indexOf(key))) !== 0;
}
export function changePermission(mask:number,key:RoomPermission, enabled:boolean) {
  const bit=1 << permissionKeys.indexOf(key);
  return enabled?mask|bit:mask&~bit;
}
