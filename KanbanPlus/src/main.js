import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


// import frappePlugin from './plugins/frappe';

window.frappe = frappe;

const app = createApp(App);

// Use the frappe plugin
// app.use(frappePlugin);

app.mount('#app');

