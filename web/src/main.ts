/**
 * Sharkophagus Web UI — Application Entrypoint
 *
 * Mounts the root Vue 3 application and imports global styles.
 */

import { createApp } from "vue";
import App from "./App.vue";
import "./assets/base.css";

const app = createApp(App);
app.mount("#app");
