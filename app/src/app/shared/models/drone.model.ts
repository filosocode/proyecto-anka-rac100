export interface Drone {
  id: string;
  serial: string;
  model: string;
  tipo: string;
  status: 'active' | 'maintenance' | 'inactive';
}
