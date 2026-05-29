import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

// RF10: sincronización - conectar con backend en siguiente sprint
@Injectable({ providedIn: 'root' })
export class SyncService {
  constructor(private storage: StorageService) {}

  isOnline(): boolean {
    return navigator.onLine;
  }

  getPendingCount(): number {
    return this.storage.keys().filter(k => k.startsWith('draft_')).length;
  }

  async syncPending(): Promise<void> {
    if (!this.isOnline()) return;
    // TODO: iterar borradores y enviar al servidor
  }
}
