<template>
  <img v-if="previewUrl" :src="previewUrl" />
  <div v-else class="preview-loading">
    <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch, onBeforeMount } from "vue";
import { fileToBase64 } from "@/utils";

const props = defineProps({
  file: {
    type: File,
    required: true,
  },
});

const previewUrl = ref<string>("");

const convertFile = async () => {
  const base64 = await fileToBase64(props.file);
  previewUrl.value = base64;
};

onBeforeMount(() => {
  if (props.file) {
    convertFile();
  }
});

watch(() => props.file, convertFile);
</script>

<style lang="less">
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.preview-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f9;
  .ivu-icon {
    color: #2d8cf0;
    animation: spin 1s linear infinite;
  }
}
</style>
