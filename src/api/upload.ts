import http from "@/utils/http";
import axios from "axios";

export default {
  getPolicy() {
    return http.get("/api/v1/upload/policy");
  },

  postFile(policy: any, data: any, callbacks: any) {
    const { onProgress, onFinished, onCancel, getCancelFn } = callbacks;
    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    return new Promise<void>((resolve, reject) => {
      axios({
        url: policy.url as string,
        method: "POST",
        data: formData,
        cancelToken: new axios.CancelToken((c) => {
          getCancelFn(c);
        }),
        onUploadProgress: (evt) => {
          const { loaded = 0, total = 0 } = evt;
          const progress = Math.floor((loaded / total) * 100);
          onProgress(progress);
        },
      })
        .then(() => {
          onFinished();
          resolve();
        })
        .catch((error) => {
          onCancel(error);
          reject(error);
        });
    });
  },
};
