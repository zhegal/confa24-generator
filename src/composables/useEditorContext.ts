import { inject } from 'vue';
import { editorKey } from './useEditor';

export function useEditorContext() {
    const editor = inject(editorKey);
    if (!editor) {
        throw new Error('Редактор не инициализирован.');
    }
    return editor;
}
