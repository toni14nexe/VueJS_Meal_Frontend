<script setup>
import { ref } from 'vue';
import BackofficeLayout from '../../layouts/BackofficeLayout.vue';
import MenusList from '../../components/backoffice/menus/MenusList.vue';
import MenusCreate from '../../components/backoffice/menus/MenusCreate.vue';
import MenusUpdate from '../../components/backoffice/menus/MenusUpdate.vue';
import MenusDelete from '../../components/backoffice/menus/MenusDelete.vue';

const tab = ref('list');
</script>

<template>
  <BackofficeLayout>
    <template #default>
      <h4>Menus</h4>
      <el-row>
        <el-space size="large">
          <el-link :class="{ active: tab === 'list' }" @click="tab = 'list'">
            <h4>List</h4>
          </el-link>
          <el-link
            :class="{ active: tab === 'create' }"
            @click="tab = 'create'"
          >
            <h4>Create</h4>
          </el-link>
          <el-link
            :class="{ active: tab === 'update' }"
            @click="tab = 'update'"
          >
            <h4>Update</h4>
          </el-link>
          <el-link
            :class="{ active: tab === 'delete' }"
            @click="tab = 'delete'"
          >
            <h4>Delete</h4>
          </el-link>
        </el-space>
      </el-row>

      <MenusList v-if="tab === 'list'" />
      <MenusCreate v-else-if="tab === 'create'" />
      <MenusUpdate v-else-if="tab === 'update'" />
      <MenusDelete v-else />
    </template>
  </BackofficeLayout>
</template>

<style scoped>
.active {
  color: var(--el-link-hover-text-color);
}
</style>
