import { Injectable } from '@angular/core';
import { Drone } from '../models/drone.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class DroneService {
  private readonly KEY = 'drones';

  constructor(private storage: StorageService) {
    this.seedDefaultDrones();
  }

  getAll(): Drone[] {
    return this.storage.get<Drone[]>(this.KEY) ?? [];
  }

  getById(id: string): Drone | null {
    return this.getAll().find(d => d.id === id) ?? null;
  }

  save(drone: Drone): void {
    const drones = this.getAll();
    const idx = drones.findIndex(d => d.id === drone.id);
    if (idx >= 0) {
      drones[idx] = drone;
    } else {
      drones.push(drone);
    }
    this.storage.set(this.KEY, drones);
  }

  delete(id: string): void {
    const drones = this.getAll().filter(d => d.id !== id);
    this.storage.set(this.KEY, drones);
  }

  generateId(): string {
    return `drone_${Date.now()}`;
  }

  private seedDefaultDrones(): void {
    const existing = this.storage.get<unknown[]>(this.KEY);
    if (existing && existing.length > 0) return;
    this.storage.set(this.KEY, [
      { id: 'd1', serial: 'DJI-001', model: 'DJI Phantom 4', status: 'active' },
      { id: 'd2', serial: 'DJI-002', model: 'DJI Mavic 3', status: 'active' },
      { id: 'd3', serial: 'AUT-003', model: 'Autel EVO II', status: 'maintenance' },
    ] as Drone[]);
  }
}
