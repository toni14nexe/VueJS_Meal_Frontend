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
      <el-affix :offset="20" class="affix">
        <div class="affix-container">
          <el-row>
            <el-link
              :class="{
                active: routeName === 'backoffice-drinks',
              }"
              @click="goTo('backoffice/drinks')"
            >
              <span class="font-weight-7">Drinks</span>
            </el-link>
          </el-row>
          <el-row>
            <el-link
              :class="{ active: routeName === 'backoffice-menus' }"
              @click="goTo('backoffice/menus')"
            >
              <span class="font-weight-7">Menus</span>
            </el-link>
          </el-row>
          <el-row>
            <el-link
              :class="{ active: routeName === 'backoffice-orders' }"
              @click="goTo('backoffice/orders')"
            >
              <span class="font-weight-7">Orders</span>
            </el-link>
          </el-row>
        </div>
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

.affix-container {
  background-color: white;
  border-radius: 5px;
  padding: 1rem;
}

.main-container {
  width: calc(80% - 5rem);
  height: fit-content;
}
</style>
