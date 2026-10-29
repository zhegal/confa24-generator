import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import EditorView from './views/EditorView.vue';
import './styles/fonts.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/controls.css';
import './styles/library.css';
import './styles/responsive.css';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', redirect: '/editor' },
        { path: '/editor/:template?', component: EditorView },
        { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
});

createApp(App).use(router).mount('#app');
