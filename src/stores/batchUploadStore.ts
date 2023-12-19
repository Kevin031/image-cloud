import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { createPromiseQueue } from "@/utils";
import { usePolicy } from "@/hooks/usePolicy";
import { getCOSUploadParam } from "@/utils/upload";
import uploadApi from "@/api/upload";

let idFlag = 0;

export const statusMap = {
  WAITING: "waiting",
  UPLOADING: "uploading",
  FAIL: "fail",
  FINISHED: "finished",
};

type FileObject = {
  file: File;
  progress: number;
  id: number;
  status: string;
  previewUrl: string;
};

export const useBatchUploadStore = defineStore("batchUpload", () => {
  const policy = usePolicy();

  const fileList = ref<FileObject[]>([]);

  /**
   * 更新文件列表
   */
  const pushFileList = (list: File[]) => {
    list
      .map((item) => ({
        file: item,
        id: idFlag++,
        progress: 0,
        status: statusMap.WAITING,
        previewUrl: "",
      }))
      .forEach((item) => {
        fileList.value.unshift(item);
      });
  };

  /**
   * 删除文件
   */
  const deleteFile = (index: number) => {
    fileList.value.splice(index, 1);
  };

  /**
   * 清空文件
   */
  const clearFileList = () => {
    fileList.value = [];
  };

  /**
   * 创建上传任务
   * @param {numbner} i 文件的索引
   * @param {Function} onProgress 上传进度回调
   * @param {Function} onFinished 上传完成回调
   */
  const createUploadTask = (
    i: number,
    onProgress: (progress: number) => void,
    onFinished: () => void,
    onCancel: (error: any) => void,
    getCancelFn: (fn: () => Function) => void
  ) => {
    // 执行真实上传命令
    const data = getCOSUploadParam(fileList.value[i].file, policy.value);
    return new Promise<void>((resolve, reject) => {
      uploadApi
        .postFile(policy.value, data, {
          onProgress,
          onFinished,
          onCancel,
          getCancelFn,
        })
        .then(() => {
          resolve();
        })
        .catch(() => {
          resolve();
        });
    });
    // 模拟上传
    // return new Promise((resolve, reject) => {
    //   let progress = 0;
    //   const interval = setInterval(() => {
    //     if (progress >= 100) {
    //       clearInterval(interval);
    //       onFinished();
    //       resolve({});
    //       return;
    //     } else {
    //       progress += 10;
    //       onProgress(progress);
    //     }
    //   }, 100);
    // });
  };

  let cancelController: any = {};

  /**
   * 处理上传完成的回调
   * @param {number} i 文件索引
   */
  const onUploadFinished = (i: number) => {
    let file = fileList.value[i].file;
    fileList.value[i].progress = 100;
    fileList.value[i].status = statusMap.FINISHED;
    fileList.value[i].previewUrl = policy.value.url + "/upload/" + file.name;
  };

  /**
   * 开始上传
   */
  const startUpload = () => {
    if (!fileList.value.length) return;
    let list: Array<() => Promise<any>> = [];
    for (let i = 0; i < fileList.value.length; i++) {
      let { status } = fileList.value[i];
      if ([statusMap.WAITING, statusMap.FAIL].includes(status)) {
        list.push(() => {
          fileList.value[i].status = statusMap.UPLOADING;
          fileList.value[i].progress = 0;
          return createUploadTask(
            // 索引
            i,
            // 更新进度
            (progress) => {
              fileList.value[i].progress = progress;
            },
            // 上传完成
            () => onUploadFinished(i),
            // 上传失败
            (err) => {
              fileList.value[i].status = statusMap.FAIL;
            },
            // 获取取消任务的回调
            (fn) => (cancelController[i] = fn)
          );
        });
      }
    }
    createPromiseQueue(list).then(() => {
      cancelController = {};
    });
    return list;
  };

  const cancelTask = (i: number) => {
    if (typeof cancelController[i] === "function") {
      cancelController[i]();
    }
  };

  const isUploading = computed(() => {
    return fileList.value.some((item) => item.status === statusMap.UPLOADING);
  });

  return {
    fileList,
    pushFileList,
    deleteFile,
    clearFileList,
    startUpload,
    cancelTask,
    isUploading: isUploading,
  };
});
