import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export function normalizeBase(value: string): string {
    const path = value.trim().replace(/^\/+|\/+$/g, '');
    return path ? `/${path}/` : '/';
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
    const inferred = repository.endsWith('.github.io') ? '/' : repository;
    const base = env.VITE_BASE_PATH?.trim() || (process.env.GITHUB_ACTIONS ? inferred : '/');

    return {
        plugins: [vue()],
        base: normalizeBase(base),
        build: {
            target: 'es2022',
        },
    };
});
