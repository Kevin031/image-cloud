<template>
  <div
    :class="[
      'upload-select-file',
      {
        dragover: isDragOver,
      },
    ]"
    @click="handleSelectFile"
    @dragover.prevent
    @dragenter.prevent="handleDragEnter"
    @mouseout.prevent="handleMouseOut"
    @drop.prevent="handleDrop"
  >
    <input ref="inputRef" type="file" multiple @change="handleFileChange" />
    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
    <span class="prompt">{{
      isDragOver ? "松开鼠标添加文件" : "点击或者选择文件上传"
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useBatchUploadStore, statusMap } from "@/stores/batchUploadStore";
import { Message } from "view-ui-plus";

const inputRef = ref<HTMLInputElement>();
const isDragOver = ref();

const handleSelectFile = () => {
  if (store.isUploading) {
    return Message.warning("当前有正在上传的任务，请稍候再试");
  }
  inputRef.value?.click();
};

const handleMouseOut = () => {
  if (isDragOver.value) {
    isDragOver.value = false;
  }
};

const handleDragEnter = (evt: DragEvent) => {
  if (evt.dataTransfer?.items.length) {
    isDragOver.value = true;
  }
};

const handleDrop = (evt: DragEvent) => {
  evt.stopPropagation();
  if (evt.dataTransfer?.items.length) {
    store.pushFileList(Array.from(evt.dataTransfer.files as FileList));
  }
};

const store = useBatchUploadStore();
const handleFileChange = () => {
  if (!inputRef.value) return;
  const files = inputRef.value.files;
  store.pushFileList(Array.from(files as FileList));
  inputRef.value.value = "";
};
</script>

<style lang="less">
.upload-select-file {
  border: dashed 1px #dcdee2;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;

  > input {
    position: absolute;
    width: 0;
    height: 0;
  }

  .prompt {
    margin-top: 12px;
  }

  &:hover {
    border-color: #2d8cf0;
  }
}
</style>
