import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

const STORAGE_KEY = 'anka_current_user';

// Usuarios de prueba hasta conectar backend real
const MOCK_USERS: (User & { password: string })[] = [
  { id: '1', email: 'admin@anka.com', password: '123456', name: 'Administrador', role: 'admin' },
  { id: '2', email: 'piloto@anka.com', password: '123456', name: 'Piloto Demo', role: 'pilot' },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user = signal<User | null>(this.loadFromStorage());

  async login(email: string, password: string): Promise<User | null> {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!found) return null;
    const { password: _, ...user } = found;
    this.user.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  logout(): void {
    this.user.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return this.user() !== null;
  }

  currentUser(): User | null {
    return this.user();
  }

  private loadFromStorage(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
