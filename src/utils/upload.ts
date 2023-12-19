export const getCOSUploadParam = (file: File, policy: any) => {
  return {
    key: "/upload/${filename}",
    policy: policy.policy,
    "q-sign-algorithm": policy.qSignAlgorithm,
    "q-ak": policy.qAk,
    "q-key-time": policy.qKeyTime,
    "q-signature": policy.qSignature,
    file: file,
  };
};
