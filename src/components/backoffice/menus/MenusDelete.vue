<script setup>
import { onMounted, ref } from 'vue';
import { menuStore } from '../../../stores/menuStore';
import { ArrowDown } from '@element-plus/icons-vue';

const storeMenu = menuStore();
const menus = ref([]);
const isLoading = ref(true);
const selectedMenu = ref();

onMounted(() => getMenus());

function getMenus() {
  isLoading.value = true;
  storeMenu.getAllMenus().then((response) => {
    menus.value = response.data?.data;
    isLoading.value = false;
  });
}

function handleMenuSelect(menu) {
  selectedMenu.value = menu;
}

function deleteMenu() {
  storeMenu.deleteMenu(selectedMenu.value.id).then(() => {
    selectedMenu.value = undefined;
    getMenus();
  });
}
</script>

<template>
  <div v-if="!isLoading" class="mt-4">
    <el-dropdown>
      <el-button type="primary" plain>
        {{ selectedMenu?.title || 'Select menu' }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-scrollbar height="300px">
            <el-dropdown-item
              v-for="menu in menus"
              @click="handleMenuSelect(menu)"
            >
              {{ menu.title }}
            </el-dropdown-item>
          </el-scrollbar>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div v-if="selectedMenu" class="mt-4">
      <el-row justify="center" class="row">Title</el-row>
      <el-row justify="center">{{ selectedMenu.title }}</el-row>
      <el-row justify="center" class="row">Type</el-row>
      <el-row justify="center">{{ selectedMenu.type }}</el-row>
      <el-row justify="center" class="row">Starter</el-row>
      <el-row justify="center">
        {{ selectedMenu?.starter ? selectedMenu.starter : '-' }}
      </el-row>
      <el-row justify="center" class="row">Desert</el-row>
      <el-row justify="center">
        {{ selectedMenu?.desert ? selectedMenu.desert : '-' }}
      </el-row>
      <el-row justify="center" class="row">Price</el-row>
      <el-row justify="center">{{ selectedMenu.price }} €</el-row>
      <el-row justify="center" class="row">Image</el-row>
      <el-image class="image" :src="selectedMenu.imageUrl" fit="fill" />
      <el-row justify="center" class="row">
        <el-button @click="deleteMenu" type="danger" plain>Delete</el-button>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.row {
  margin-top: 1rem;
  font-size: small;
  color: var(--secondary-text-color);
}

.input {
  max-width: 300px;
}

.image {
  width: 150px;
  height: 150px;
  border-radius: 5px;
}
</style>
