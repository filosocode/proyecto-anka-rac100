import { Injectable } from '@angular/core';
import { FormEntry, FormTemplate } from '../models/form.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class FormService {
  private readonly TEMPLATES_KEY = 'form_templates';
  private readonly ENTRIES_KEY = 'form_entries';

  constructor(private storage: StorageService) {
    this.seedDefaultTemplates();
  }

  // ─── Plantillas ──────────────────────────────────────────────────────────

  getTemplates(): FormTemplate[] {
    return this.storage.get<FormTemplate[]>(this.TEMPLATES_KEY) ?? [];
  }

  getTemplate(id: string): FormTemplate | null {
    return this.getTemplates().find(t => t.id === id) ?? null;
  }

  // ─── Entradas (formularios diligenciados / borradores) ───────────────────

  getEntries(): FormEntry[] {
    return this.storage.get<FormEntry[]>(this.ENTRIES_KEY) ?? [];
  }

  getDrafts(): FormEntry[] {
    return this.getEntries().filter(e => e.status === 'draft');
  }

  getSubmitted(): FormEntry[] {
    return this.getEntries().filter(
      e => e.status === 'submitted' || e.status === 'synced'
    );
  }

  getEntry(id: string): FormEntry | null {
    return this.getEntries().find(e => e.id === id) ?? null;
  }

  saveEntry(entry: FormEntry): void {
    const entries = this.getEntries();
    const idx = entries.findIndex(e => e.id === entry.id);
    if (idx >= 0) {
      entries[idx] = { ...entry, updatedAt: new Date().toISOString() };
    } else {
      entries.push({ ...entry, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.storage.set(this.ENTRIES_KEY, entries);
  }

  deleteEntry(id: string): void {
    const entries = this.getEntries().filter(e => e.id !== id);
    this.storage.set(this.ENTRIES_KEY, entries);
  }

  generateId(): string {
    return `entry_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  generateTemplateId(): string {
    return `tpl_${Date.now()}`;
  }

  saveTemplate(template: FormTemplate): void {
    const templates = this.getTemplates();
    const idx = templates.findIndex(t => t.id === template.id);
    if (idx >= 0) {
      templates[idx] = template;
    } else {
      templates.push(template);
    }
    this.storage.set(this.TEMPLATES_KEY, templates);
  }

  deleteTemplate(id: string): void {
    const templates = this.getTemplates().filter(t => t.id !== id);
    this.storage.set(this.TEMPLATES_KEY, templates);
  }

  toggleActive(id: string): void {
    const templates = this.getTemplates();
    const idx = templates.findIndex(t => t.id === id);
    if (idx < 0) return;
    templates[idx] = { ...templates[idx], active: !templates[idx].active };
    this.storage.set(this.TEMPLATES_KEY, templates);
  }

  // ─── Seed ─────────────────────────────────────────────────────────────────

  private seedDefaultTemplates(): void {
    const existing = this.storage.get<unknown[]>(this.TEMPLATES_KEY);
    if (existing && existing.length > 0) return;

    const templates: FormTemplate[] = [
      {
        id: 'tpl-prevuelo',
        title: 'Inspección Pre-Vuelo RAC 100',
        active: true,
        fields: [
          { name: 'drone_id', label: 'ID del Dron', type: 'text', required: true },
          { name: 'piloto', label: 'Nombre del Piloto', type: 'text', required: true },
          { name: 'zona_operacion', label: 'Zona de Operación', type: 'text', required: true },
          { name: 'condicion_clima', label: 'Condición Climática', type: 'select', required: true, options: ['Despejado', 'Nublado', 'Lluvia leve'] },
          { name: 'bateria_carga', label: '% Batería inicial', type: 'number', required: true },
          { name: 'observaciones', label: 'Observaciones', type: 'text', required: false },
        ],
      },
      {
        id: 'tpl-postvuelo',
        title: 'Reporte Post-Vuelo RAC 100',
        active: true,
        fields: [
          { name: 'drone_id', label: 'ID del Dron', type: 'text', required: true },
          { name: 'piloto', label: 'Nombre del Piloto', type: 'text', required: true },
          { name: 'duracion_vuelo', label: 'Duración del Vuelo (min)', type: 'number', required: true },
          { name: 'incidentes', label: 'Incidentes', type: 'select', required: true, options: ['Ninguno', 'Falla técnica', 'Emergencia climática', 'Otro'] },
          { name: 'bateria_restante', label: '% Batería restante', type: 'number', required: true },
          { name: 'observaciones', label: 'Observaciones', type: 'text', required: false },
        ],
      },
      {
        id: 'tpl-autorizacion',
        title: 'Solicitud de Autorización de Operación',
        active: true,
        fields: [
          { name: 'piloto', label: 'Piloto Responsable', type: 'text', required: true },
          { name: 'empresa', label: 'Empresa Operadora', type: 'text', required: true },
          { name: 'fecha_operacion', label: 'Fecha de Operación', type: 'text', required: true },
          { name: 'zona', label: 'Zona Geográfica', type: 'text', required: true },
          { name: 'altura_max', label: 'Altura Máxima (m)', type: 'number', required: true },
          { name: 'tipo_operacion', label: 'Tipo de Operación', type: 'select', required: true, options: ['Fotogrametría', 'Inspección', 'Topografía', 'Otro'] },
        ],
      },
    ];

    this.storage.set(this.TEMPLATES_KEY, templates);
  }
}
