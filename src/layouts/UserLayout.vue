<script setup>
import { ref } from 'vue';
import { router } from '../main';

const active = ref('Dashboard');

function goTo(link) {
  if (link === 'dashboard' && router.currentRoute.value.path !== '/')
    router.push('/');
  else if (
    link === 'backoffice' &&
    router.currentRoute.value.path !== '/backoffice'
  )
    router.push('/backoffice');
}
</script>

<template>
  <div class="layout-container">
    <el-row class="container">
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
    </el-row>
    <el-row>
      <slot />
    </el-row>
  </div>
</template>

<style scoped>
.active {
  color: var(--el-link-hover-text-color);
}
</style>
