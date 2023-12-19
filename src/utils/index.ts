/**
 * 文件转base64
 * @param {File} file
 * @returns
 */
export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader: FileReader = new FileReader();
    reader.onload = (evt: any) => {
      resolve(evt.target.result);
    };
    reader.readAsDataURL(file);
  });

/**
 * 创建有限制的并发请求队列
 * @param {Array} tasks 请求队列
 * @param {number} limit 限制数量
 * @returns
 */
export const createPromiseQueue = (
  tasks: Array<() => Promise<any>>,
  limit: number = 5
) => {
  const result = new Map();
  let currentIndex = 0;

  const run: () => Promise<any> = () => {
    // 跳出循环
    if (currentIndex >= tasks.length) {
      return Promise.resolve();
    }

    const index = currentIndex;
    currentIndex += 1;
    const task = tasks[index];
    return task()
      .then((res) => {
        result.set(index, res);
        return run();
      })
      .catch(() => {
        return run();
      });
  };

  // 前limit个并发，后续是请求完一条就新开一条替换他，无需再考虑并发
  const promiseList = Array(Math.min(limit, tasks.length))
    .fill(Promise.resolve())
    .map((promise) => promise.then(run));

  return Promise.all(promiseList).then(() => {
    return tasks.map((_, i) => result.get(i));
  });
};
