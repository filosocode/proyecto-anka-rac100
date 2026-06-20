import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

// RF10: sincronización pendiente — conectar con backend en sprint siguiente
@Injectable({ providedIn: 'root' })
export class SyncService {
  constructor(private storage: StorageService) {}

  isOnline(): boolean {
    return navigator.onLine;
  }

  getPendingCount(): number {
    const entries = this.storage.get<any[]>('form_entries') ?? [];
    return entries.filter(e => e.status === 'submitted').length;
  }

  async syncPending(): Promise<void> {
    if (!this.isOnline()) return;

    const entries = this.storage.get<any[]>('form_entries') ?? [];
    const pendientes = entries.filter(e => e.status === 'submitted').length;
    if (pendientes === 0) return;

    const actualizados = entries.map(e =>
      e.status === 'submitted'
        ? { ...e, status: 'synced', updatedAt: new Date().toISOString() }
        : e
    );
    this.storage.set('form_entries', actualizados);
  }
}
