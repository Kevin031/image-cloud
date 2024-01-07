<template>
  <div>
    <div class="upload-wrapper">
      <UploadSelectFile />
    </div>
    <div class="action-wrapper">
      <Button @click="clearFileList" :disabled="!store.fileList.length"
        >清空</Button
      >
      <Button
        type="primary"
        :disabled="!store.fileList.length"
        @click="startUpload"
        >开始上传</Button
      >
    </div>
    <div class="table-wrapper">
      <Table :columns="columns" :data="store.fileList" row-key="id">
        <template #name="{ row }">
          <div class="file-content">
            <Image
              class="preview"
              :src="row.previewUrl"
              fit="contain"
              preview
              v-if="row.previewUrl"
              :preview-list="[row.previewUrl]"
            />
            <FileImagePreview v-else class="preview" :file="row.file" />
            <div class="name">{{ row.file.name }}</div>
          </div>
        </template>
        <template #size="{ row }">
          <div>{{ formatFileSize(row.file.size) }}</div>
        </template>
        <template #progress="{ row }">
          <Progress
            :percent="row.progress"
            :status="row.status === 'fail' ? 'wrong' : 'active'"
          ></Progress>
        </template>
        <template #action="{ row, index }">
          <a
            v-if="row.status === 'uploading'"
            href="javascript:;"
            class="delete-btn"
            @click="handleCancel(index)"
            >取消</a
          >
          <a
            v-else
            href="javascript:;"
            class="delete-btn"
            @click="handleDelete(index)"
            >删除</a
          >
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UploadSelectFile from "@/components/UploadSelectFile.vue";
import { useBatchUploadStore } from "@/stores/batchUploadStore";
import FileImagePreview from "@/components/FileImagePreview.vue";
import { Message } from "view-ui-plus";

const store = useBatchUploadStore();

const columns = [
  {
    title: "文件内容",
    slot: "name",
    width: 300,
  },
  {
    title: "ID",
    key: "id",
  },
  {
    title: "文件大小",
    slot: "size",
  },
  {
    title: "上传进度",
    slot: "progress",
  },
  {
    title: "操作",
    align: "right",
    slot: "action",
    width: 80,
  },
];

const handleCancel = (index: number) => {
  store.cancelTask(index);
};

const handleDelete = (index: number) => {
  store.deleteFile(index);
};

const toFixedSecondary = (num: number) => {
  return (Math.floor(num * 100) / 100).toFixed(2);
};

/**
 * 格式化文件尺寸
 * @param size 原始尺寸，单位B
 */
const formatFileSize = (size: number) => {
  let kb = size / 1024;
  if (kb > 1024) {
    return `${toFixedSecondary(kb / 1024)} MB`;
  }
  return `${toFixedSecondary(kb)} KB`;
};

const startUpload = () => {
  if (store.isUploading) {
    Message.warning("当前有正在上传的任务，请稍后再试");
    return;
  }
  let tasks = store.startUpload();
  if (!tasks?.length) {
    Message.warning("没有可以执行的任务");
  }
};

const clearFileList = () => {
  if (store.isUploading) {
    Message.warning("当前有正在上传的任务，请稍后再试");
    return;
  }
  store.clearFileList();
};
</script>

<style lang="less">
.upload-wrapper {
  margin-bottom: 16px;
}
.action-wrapper {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
  .ivu-btn {
    margin-left: 8px;
  }
}
.table-wrapper {
  .file-content {
    display: flex;
    align-items: center;
    padding: 12px 0;
    .preview {
      width: 80px;
      height: 80px;
      border-radius: 4px;
      background-color: #f8f8f9;
      object-fit: contain;
      flex-shrink: 0;
    }
    .name {
      margin-left: 12px;
    }
  }
  .delete-btn {
    color: #db4e2c;
  }
}
</style>
