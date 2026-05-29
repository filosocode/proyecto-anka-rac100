import { Injectable } from '@angular/core';

// RF5: almacenamiento offline usando localStorage (sin dependencias externas)
@Injectable({ providedIn: 'root' })
export class StorageService {
  set(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  keys(): string[] {
    return Object.keys(localStorage);
  }
}
