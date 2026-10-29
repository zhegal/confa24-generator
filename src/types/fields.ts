export interface FieldOption {
    value: string;
    label: string;
}

export interface FieldDefinition {
    path: string;
    label: string;
    type?: 'text' | 'textarea' | 'select' | 'range' | 'color' | 'toggle' | 'number' | 'time';
    options?: FieldOption[];
    min?: number;
    max?: number;
    step?: number;
    hint?: string;
}

export function options(values: Record<string, string>): FieldOption[] {
    return Object.entries(values).map(([value, label]) => ({ value, label }));
}
