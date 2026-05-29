export interface Drone {
  id: string;
  serial: string;
  model: string;
  status: 'active' | 'maintenance' | 'inactive';
}
