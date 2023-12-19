import http from "@/utils/http";

export default {
  login(data: any) {
    return http.post("/api/v1/login/auth", data);
  },

  isLogin() {
    return http.get("/api/v1/login/is-login");
  },
};
