export interface FormTemplate {
  id: string;
  title: string;
  fields: FormField[];
  active: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'file' | 'location';
  required: boolean;
  options?: string[];
}

export interface FormEntry {
  id: string;
  templateId: string;
  pilotId: string;
  data: Record<string, any>;
  status: 'draft' | 'submitted' | 'synced';
  createdAt: string;
  updatedAt: string;
}
