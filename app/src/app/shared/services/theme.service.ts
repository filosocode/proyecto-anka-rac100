import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _dark = signal(false);
  readonly isDark = this._dark.asReadonly();

  constructor() {
    const saved = localStorage.getItem('anka-theme');
    this.apply(saved === 'dark');
  }

  toggle(): void {
    this.apply(!this._dark());
  }

  private apply(dark: boolean): void {
    this._dark.set(dark);
    document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('anka-theme', dark ? 'dark' : 'light');
  }
}
