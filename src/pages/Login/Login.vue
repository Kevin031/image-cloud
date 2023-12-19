<template>
  <div class="login-page">
    <div class="login-modal">
      <Login @on-submit="handleSubmit">
        <UserName name="username" />
        <Password name="password" />
        <div class="auto-login">
          <Checkbox v-model="autoLogin" size="large">自动登录</Checkbox>
          <a>忘记密码</a>
        </div>
        <Submit />
      </Login>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import API from "@/api/login";

const autoLogin = ref(false);
const handleSubmit = async (valid, { username, password }) => {
  if (valid) {
    // console.log({ username, password });
    const res = await API.login({ username, password });
    console.log("res", res);
  }
};
</script>

<style lang="less">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .login-modal {
    width: 400px;
  }

  .auto-login {
    margin-bottom: 16px;
  }
}
</style>
