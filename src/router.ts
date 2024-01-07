import * as VueRouter from "vue-router";
import BatchUpload from "@/pages/BatchUpload/BatchUpload.vue";
import Login from "./pages/Login/Login.vue";
import Library from "./pages/Library/Library.vue";

const routes = [
  { path: "/", component: BatchUpload },
  { path: "/login", component: Login },
  { path: "/batch-upload", component: BatchUpload },
  { path: "/library", component: Library },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

export default router;
