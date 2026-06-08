export interface FormTemplate {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'file';
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
