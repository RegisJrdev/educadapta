import { createApp } from 'vue';
import App from './App.vue';
import { route } from './demo/navigation.js';
import './style.css';
import './demo.css';

window.route = route;
const app = createApp(App);
app.config.globalProperties.route = route;
app.mount('#app');
