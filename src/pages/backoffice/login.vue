<script setup>
import { onBeforeMount, ref, computed } from 'vue';
import { checkAdminAuthorization } from '../../modules/authorization';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import { router } from '../../main';
import { adminStore } from '../../stores/adminStore';

const storeAdmin = adminStore();
const loginData = ref({
  username: '',
  password: '',
});

onBeforeMount(() => checkAdminAuthorization());

const validData = computed(() => {
  if (
    loginData.value.username.length > 3 &&
    loginData.value.password.length > 3
  )
    return true;
  return false;
});

function goBackToUserDashboard() {
  router.push('/');
}

function login() {
  if (validData.value) {
    storeAdmin.login(loginData.value);
  }
}
</script>

<template>
  <el-row class="mt-8" justify="center">
    <div class="login-wrapper">
      <el-input
        v-model="loginData.username"
        placeholder="Admin username"
        @keydown.enter="login"
      />
      <el-input
        v-model="loginData.password"
        type="password"
        placeholder="Admin password"
        @keydown.enter="login"
      />
      <el-row class="mt-4" justify="space-between">
        <el-button plain type="danger" @click="goBackToUserDashboard">
          <el-icon class="mr-2"><ArrowLeft /></el-icon>
          Back
        </el-button>
        <el-button plain type="success" :disabled="!validData" @click="login">
          Login
          <el-icon class="ml-2"><ArrowRight /></el-icon>
        </el-button>
      </el-row>
    </div>
  </el-row>
</template>

<style scoped>
.login-wrapper {
  width: 300px;
}
</style>
