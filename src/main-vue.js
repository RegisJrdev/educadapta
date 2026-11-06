import { createApp } from 'vue';
import App from './App.vue';
import { initializeDemo, route } from './demo/navigation.js';
import './style.css';
import './demo.css';

window.route = route;
const app = createApp(App);
app.config.globalProperties.route = route;
initializeDemo().finally(() => app.mount('#app'));
