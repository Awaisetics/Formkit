import { createApp } from 'vue'
import App from './App.vue'
import { provideGlobals } from './globals';
import { plugin, defaultConfig } from '@formkit/vue'
import config from './formkit.config.js'
import '@formkit/themes/genesis'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/main.css';


const app = createApp(App);
app.use(plugin, defaultConfig(config))
app.config.globalProperties.$provideGlobals = provideGlobals;

app.mount('#app');