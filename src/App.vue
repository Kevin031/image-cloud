<script setup lang="ts"></script>

<template>
  <Layout>
    <Content
      :style="{ padding: '24px', minHeight: '280px', background: '#fff' }"
    >
      <RouterView />
    </Content>
  </Layout>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
