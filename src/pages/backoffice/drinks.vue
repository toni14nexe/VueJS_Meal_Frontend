<script setup>
import { ref } from 'vue';
import BackofficeLayout from '../../layouts/BackofficeLayout.vue';
import DrinksList from '../../components/backoffice/drinks/DrinksList.vue';
import DrinksCreate from '../../components/backoffice/drinks/DrinksCreate.vue';
import DrinksUpdate from '../../components/backoffice/drinks/DrinksUpdate.vue';
import DrinksDelete from '../../components/backoffice/drinks/DrinksDelete.vue';

const tab = ref('list');
</script>

<template>
  <BackofficeLayout>
    <template #default>
      <h4>Drinks</h4>
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

      <DrinksList v-if="tab === 'list'" />
      <DrinksCreate v-else-if="tab === 'create'" />
      <DrinksUpdate v-else-if="tab === 'update'" />
      <DrinksDelete v-else />
    </template>
  </BackofficeLayout>
</template>

<style scoped>
.active {
  color: var(--el-link-hover-text-color);
}
</style>
