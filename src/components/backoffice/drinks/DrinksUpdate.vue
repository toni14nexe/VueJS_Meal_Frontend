<script setup>
import { onMounted, ref, computed } from 'vue';
import { drinkStore } from '../../../stores/drinkStore';
import { ArrowDown } from '@element-plus/icons-vue';

const storeDrink = drinkStore();
const drinks = ref([]);
const isLoading = ref(true);
const selectedDrink = ref();

onMounted(() => getDrinks());

function getDrinks() {
  isLoading.value = true;
  storeDrink.getAllDrinks().then((response) => {
    drinks.value = response.data;
    isLoading.value = false;
  });
}

const isValid = computed(() => {
  if (
    selectedDrink.value.title.length > 3 &&
    selectedDrink.value.imageUrl.length > 7
  )
    return true;
  return false;
});

function handleDrinkSelect(drink) {
  selectedDrink.value = drink;
  selectedDrink.value.oldTitle = drink.title;
}

function update() {
  if (isValid.value)
    storeDrink.updateDrink(selectedDrink.value).then(() => {
      selectedDrink.value = undefined;
      getDrinks();
    });
}
</script>

<template>
  <div v-if="!isLoading" class="mt-4">
    <el-dropdown>
      <el-button type="primary" plain style="width: 300px">
        {{ selectedDrink?.oldTitle || 'Select drink' }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="drink in drinks"
            @click="handleDrinkSelect(drink)"
          >
            {{ drink.title }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div v-if="selectedDrink" class="mt-4">
      <el-row justify="center" class="row">Title</el-row>
      <el-row justify="center">
        <el-input
          class="input"
          v-model="selectedDrink.title"
          placeholder="Title"
        />
      </el-row>
      <el-row justify="center" class="row">Image URL</el-row>
      <el-row justify="center">
        <el-input
          class="input"
          v-model="selectedDrink.imageUrl"
          placeholder="Image URL"
        />
      </el-row>
      <el-row justify="center" class="row">
        <el-image class="image" :src="selectedDrink.imageUrl" fit="fill" />
      </el-row>
      <el-row justify="center" class="row">
        <el-button :disabled="!isValid" @click="update">Update</el-button>
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
