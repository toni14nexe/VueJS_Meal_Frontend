<script setup>
import { ref, computed } from 'vue';
import { drinkStore } from '../../../stores/drinkStore';
import { ArrowDown } from '@element-plus/icons-vue';

const storeDrink = drinkStore();
const drinkData = ref({
  title: '',
  imageUrl: '',
});

const isValid = computed(() => {
  if (drinkData.value.title.length > 3 && drinkData.value.imageUrl.length > 7)
    return true;
  return false;
});

function create() {
  if (isValid.value)
    storeDrink.createDrink(drinkData.value).then(() => {
      drinkData.value = {
        title: '',
        imageUrl: '',
      };
    });
}
</script>

<template>
  <div class="mt-4">
    <el-row justify="center" class="row">Title</el-row>
    <el-row justify="center">
      <el-input class="input" v-model="drinkData.title" placeholder="Title" />
    </el-row>
    <el-row justify="center" class="row">Image URL</el-row>
    <el-row justify="center">
      <el-input
        class="input"
        v-model="drinkData.imageUrl"
        placeholder="Image URL"
      />
    </el-row>
    <el-row justify="center" class="row">
      <el-image class="image" :src="drinkData.imageUrl" fit="fill" />
    </el-row>
    <el-row justify="center" class="row">
      <el-button @click="create" :disabled="!isValid">Create</el-button>
    </el-row>
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
