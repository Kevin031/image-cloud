import axios from "axios";
import { Message } from "view-ui-plus";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

let accessToken: string;

const request = (options: any) =>
  new Promise((resolve, reject) => {
    if (!accessToken) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        accessToken = token;
      }
    }

    // 注入请求头
    if (!options.headers) {
      options.headers = {};
    }
    options.headers["Access-Token"] = accessToken;
    options.headers["Content-Type"] = "application/json";

    axios(options)
      .then((res) => {
        let staRes = res.data;
        if (staRes.code === "0") {
          resolve(staRes.data);
        } else {
          Message.error(staRes.msg);
          reject(staRes);
        }
      })
      .catch((err) => {
        const { status, data } = err.response;
        if (status === 401) {
          location.href = window.origin + "/#/login";
        } else {
          Message.error(data?.msg || "请求失败");
          reject(err);
        }
      });
  });

export default {
  get: (url: string = "", params: object = {}, options: object = {}) =>
    request({
      method: "GET",
      url,
      params,
      ...options,
    }),
  post: (url: string = "", body: object = {}, options: object = {}) =>
    request({
      method: "POST",
      url,
      body,
      ...options,
    }),
};
