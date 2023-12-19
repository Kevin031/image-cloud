import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ViewUiPlus from "view-ui-plus";
import { createPinia } from "pinia";
import "view-ui-plus/dist/styles/viewuiplus.css";

const pinia = createPinia();

const app = createApp(App);
app.use(router).use(ViewUiPlus).use(pinia);

app.mount("#app");
