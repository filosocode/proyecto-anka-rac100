import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

interface StoredUser extends User {
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_KEY = 'session_user';
  private readonly USERS_KEY = 'users';

  currentUser = signal<User | null>(null);

  constructor(private storage: StorageService, private router: Router) {
    this.seedDefaultUsers();
    const saved = this.storage.get<User>(this.SESSION_KEY);
    if (saved) this.currentUser.set(saved);
  }

  login(email: string, password: string): boolean {
    const users = this.storage.get<StoredUser[]>(this.USERS_KEY) ?? [];
    const match = users.find(u => u.email === email && u.password === password);
    if (!match) return false;
    const { password: _pw, ...user } = match;
    this.currentUser.set(user);
    this.storage.set(this.SESSION_KEY, user);
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    this.storage.remove(this.SESSION_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  getUsers(): StoredUser[] {
    return this.storage.get<StoredUser[]>(this.USERS_KEY) ?? [];
  }

  addUser(user: StoredUser): void {
    const users = this.getUsers();
    users.push(user);
    this.storage.set(this.USERS_KEY, users);
  }

  updateUser(id: string, changes: Partial<StoredUser>): void {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx < 0) return;
    users[idx] = { ...users[idx], ...changes };
    this.storage.set(this.USERS_KEY, users);
    if (this.currentUser()?.id === id) {
      const { password: _pw, ...user } = users[idx];
      this.currentUser.set(user);
      this.storage.set(this.SESSION_KEY, user);
    }
  }

  deleteUser(id: string): void {
    const users = this.getUsers().filter(u => u.id !== id);
    this.storage.set(this.USERS_KEY, users);
  }

  generateUserId(): string {
    return `user_${Date.now()}`;
  }

  private seedDefaultUsers(): void {
    const existing = this.storage.get<unknown[]>(this.USERS_KEY);
    if (existing && existing.length > 0) return;
    this.storage.set(this.USERS_KEY, [
      { id: '1', email: 'admin@anka.co', password: '1234', name: 'Administrador', role: 'admin' },
      { id: '2', email: 'piloto@anka.co', password: '1234', name: 'Piloto Demo', role: 'pilot' },
    ]);
  }
}
