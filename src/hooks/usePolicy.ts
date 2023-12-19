import { ref } from "vue";
import uploadApi from "@/api/upload";

export const usePolicy = () => {
  const policy = ref<any>({});

  uploadApi.getPolicy().then((res) => {
    policy.value = res as any;
  });

  return policy;
};
