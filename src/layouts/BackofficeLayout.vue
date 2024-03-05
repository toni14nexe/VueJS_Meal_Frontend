<script setup>
import { ref, onBeforeMount } from 'vue';
import { router } from '../main';
import cookies from 'vue-cookies';

onBeforeMount(() => {
  if (!cookies.get('authorization')) router.replace('/backoffice/login');
});

const active = ref('Backoffice');
const routeName = ref(router.currentRoute.value.name);

function goTo(link) {
  if (link === 'dashboard') link = '';
  router.push(`/${link}`);
}

function logout() {
  cookies.remove('authorization');
  router.push('/backoffice/login');
}
</script>

<template>
  <div class="layout-container">
    <el-row class="container" justify="space-between">
      <el-space size="large">
        <el-link
          :class="{ active: active === 'Dashboard' }"
          @click="goTo('dashboard')"
        >
          <h3>Dashboard</h3>
        </el-link>
        <el-link
          :class="{ active: active === 'Backoffice' }"
          @click="goTo('backoffice')"
        >
          <h3>Backoffice</h3>
        </el-link>
      </el-space>
      <el-link @click="logout">
        <h3>Logout</h3>
      </el-link>
    </el-row>

    <el-row>
      <el-affix :offset="50" class="affix container">
        <el-row>
          <el-link
            :class="{
              active: routeName === 'backoffice-drinks',
            }"
            @click="goTo('backoffice/drinks')"
          >
            <h4>Drinks</h4>
          </el-link>
        </el-row>
        <el-row>
          <el-link
            :class="{ active: routeName === 'backoffice-menus' }"
            @click="goTo('backoffice/menus')"
          >
            <h4>Menus</h4>
          </el-link>
        </el-row>
        <el-row>
          <el-link
            :class="{ active: routeName === 'backoffice-orders' }"
            @click="goTo('backoffice/orders')"
          >
            <h4>Orders</h4>
          </el-link>
        </el-row>
      </el-affix>

      <div
        v-if="routeName !== 'backoffice-dashboard'"
        class="ml-4 container main-container"
      >
        <slot />
      </div>
    </el-row>
  </div>
</template>

<style scoped>
.active {
  color: var(--el-link-hover-text-color);
}

.affix {
  width: 20%;
}

.main-container {
  width: calc(80% - 9rem);
  height: fit-content;
}
</style>
