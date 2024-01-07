<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import http from "@/utils/http";

const route = useRoute();
const router = useRouter();

const hideHeader = computed(() => {
  return ["/login"].includes(route.path);
});

const menuList = [
  {
    title: "图库",
    path: "/library",
  },
  {
    title: "批量上传",
    path: "/batch-upload",
  },
];

const handleLogOut = () => {
  http.clearToken();
  router.replace("/login");
};
</script>

<template>
  <Layout>
    <div v-if="!hideHeader" class="page-header">
      <h1 class="logo">🌄 Image Cloud</h1>
      <div class="menu">
        <a
          v-for="item in menuList"
          :class="{ active: item.path === route.path }"
          @click="router.replace(item.path)"
          href="javascript:;"
          >{{ item.title }}</a
        >
      </div>
      <Dropdown placement="bottom-end">
        <div class="user-info">
          <Badge dot>
            <Avatar shape="square" icon="ios-person" />
          </Badge>
          <span class="user-name">user</span>
        </div>
        <template #list>
          <DropdownMenu>
            <DropdownItem @click="handleLogOut">注销</DropdownItem>
          </DropdownMenu>
        </template>
      </Dropdown>
    </div>
    <Content
      :style="{ padding: '24px', minHeight: '280px', background: '#fff' }"
    >
      <RouterView />
    </Content>
  </Layout>
</template>

<style lang="less">
.page-header {
  padding-top: 0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 56px;

  h1 {
    font-weight: normal;
  }

  .menu {
    padding-left: 16px;
    flex: 1;

    a {
      padding: 0 16px;
      color: #333;
      &:hover {
        color: #2d8cf0;
      }
      &.active {
        color: #2d8cf0;
        font-weight: 600;
      }
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    &:hover {
      background-color: #fff;
    }
    .user-name {
      margin-left: 8px;
      font-size: 14px;
    }
  }
}
</style>
