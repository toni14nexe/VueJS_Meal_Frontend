<script setup>
import { ref } from 'vue';
import BackofficeLayout from '../../layouts/BackofficeLayout.vue';
import OrdersList from '../../components/backoffice/orders/OrdersList.vue';

const tab = ref('list');
</script>

<template>
  <BackofficeLayout>
    <template #default>
      <h4>Orders</h4>
      <el-row>
        <el-space size="large">
          <el-link :class="{ active: tab === 'list' }" @click="tab = 'list'">
            <h4>List</h4>
          </el-link>
        </el-space>
      </el-row>

      <OrdersList v-if="tab === 'list'" />
    </template>
  </BackofficeLayout>
</template>

<style scoped>
.active {
  color: var(--el-link-hover-text-color);
}
</style>
