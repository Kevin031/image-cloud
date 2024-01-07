<template>
  <div class="login-page">
    <div class="login-modal">
      <Login @on-submit="handleSubmit">
        <UserName name="username" />
        <Password name="password" :enter-to-submit="true" />
        <!-- <div class="auto-login">
          <Checkbox v-model="autoLogin" size="large">自动登录</Checkbox>
          <a>忘记密码</a>
        </div> -->
        <Submit />
      </Login>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import API from "@/api/login";
import { useRouter } from "vue-router";

const autoLogin = ref(false);
const router = useRouter();

const jumpToEntry = () => {
  router.push("/batch-upload");
};

API.isLogin().then((res: any) => {
  if (res && res.login) {
    jumpToEntry();
  }
});

const handleSubmit = async (valid, { username, password }) => {
  if (valid) {
    const res: any = await API.login({ username, password });
    if (res && res.token) {
      localStorage.setItem("accessToken", res.token);
      jumpToEntry();
    }
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
