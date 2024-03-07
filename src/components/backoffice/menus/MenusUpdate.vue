<script setup>
import { onMounted, ref, computed } from 'vue';
import { menuStore } from '../../../stores/menuStore';
import { drinkStore } from '../../../stores/drinkStore';
import { ArrowDown } from '@element-plus/icons-vue';

const storeMenu = menuStore();
const storeDrink = drinkStore();
const menus = ref([]);
const drinks = ref([]);
const isLoading = ref(true);
const selectedMenu = ref();
const types = ref([
  'Pork',
  'Seafood',
  'Chicken',
  'Beef',
  'Vegeterian',
  'Celebrate',
  'Kosher',
  'Kids',
  'Breakfast',
]);

onMounted(() => {
  getMenus();
  getDrinks();
});

function getMenus() {
  isLoading.value = true;
  storeMenu.getAllMenus().then((response) => {
    menus.value = response.data?.data;
    isLoading.value = false;
  });
}

function getDrinks() {
  storeDrink.getAllDrinks().then((response) => (drinks.value = response.data));
}

const isValid = computed(() => {
  if (
    selectedMenu.value.title.length > 3 &&
    selectedMenu.value.type &&
    selectedMenu.value.imageUrl.length > 7 &&
    selectedMenu.value.price > 0 &&
    selectedMenu.value.drink.length <= 3
  )
    return true;
  return false;
});

function handleMenuSelect(menu) {
  selectedMenu.value = menu;
  selectedMenu.value.oldTitle = menu.title;
}

function imageSelectHandler(drinkData) {
  const alreadyExist = selectedMenu.value.drink.some(
    (drink) => drink.id === drinkData.id
  );
  if (alreadyExist)
    selectedMenu.value.drink = selectedMenu.value.drink.filter(
      (drink) => drink.id !== drinkData.id
    );
  else if (selectedMenu.value.drink.length < 3)
    selectedMenu.value.drink.push(drinkData);
}

function update() {
  if (!selectedMenu.value.starter?.length) selectedMenu.value.starter = null;
  if (!selectedMenu.value.desert?.length) selectedMenu.value.desert = null;
  if (isValid.value)
    storeMenu.updateMenu(selectedMenu.value).then(() => {
      selectedMenu.value = undefined;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      getMenus();
    });
}
</script>

<template>
  <div v-if="!isLoading" class="mt-4">
    <el-dropdown>
      <el-button type="primary" plain class="dropdown-button">
        {{ selectedMenu?.oldTitle || 'Select menu' }}
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
      <el-row justify="center">
        <el-input
          class="input"
          v-model="selectedMenu.title"
          placeholder="Title"
        />
      </el-row>
      <el-row justify="center" class="row">Type</el-row>
      <el-row justify="center">
        <el-dropdown>
          <el-button class="dropdown-button" type="primary" plain>
            {{ selectedMenu?.type || 'Select type' }}
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="menuType in types"
                @click="selectedMenu.type = menuType"
              >
                {{ menuType }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-row>
      <el-row justify="center" class="row">Starter</el-row>
      <el-row justify="center">
        <el-input
          class="input"
          v-model="selectedMenu.starter"
          placeholder="Starter"
        />
      </el-row>
      <el-row justify="center" class="row">Desert</el-row>
      <el-row justify="center">
        <el-input
          class="input"
          v-model="selectedMenu.desert"
          placeholder="Desert"
        />
      </el-row>
      <el-row justify="center" class="row">Price</el-row>
      <el-row justify="center">
        <el-input-number
          class="input"
          v-model="selectedMenu.price"
          placeholder="Price"
          :precision="2"
          :step="0.01"
        />
      </el-row>
      <el-row justify="center" class="row">Image URL</el-row>
      <el-row justify="center">
        <el-input
          class="input"
          v-model="selectedMenu.imageUrl"
          placeholder="Image URL"
        />
      </el-row>
      <el-row justify="center" class="row">
        <el-image class="image" :src="selectedMenu.imageUrl" fit="fill" />
      </el-row>
      <el-row justify="center" class="row">Choose drinks</el-row>
      <el-row justify="center" class="row">
        <div class="drinks-container">
          <el-tooltip
            v-for="drink in drinks"
            effect="light"
            placement="top"
            :content="
              selectedMenu.drink.length <= 2
                ? drink.title
                : 'Maximum drinks selected'
            "
          >
            <el-image
              class="drink-image"
              :src="drink.imageUrl"
              fit="fill"
              @click="imageSelectHandler(drink)"
            />
          </el-tooltip>
        </div>
      </el-row>
      <el-row justify="center" class="row">
        {{ `Selected drinks - ${selectedMenu.drink.length}/3` }}
      </el-row>
      <el-row justify="center" class="row">
        <div v-if="selectedMenu.drink.length" class="drinks-container">
          <el-tooltip
            v-for="drink in selectedMenu.drink"
            effect="light"
            placement="top"
            content="Remove selected drink"
          >
            <el-image
              class="drink-image"
              :src="drink.imageUrl"
              fit="fill"
              @click="imageSelectHandler(drink)"
            />
          </el-tooltip>
        </div>
        <span v-else>- Drink not selected -</span>
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
  width: 300px;
}

.image {
  width: 150px;
  height: 150px;
  border-radius: 5px;
}

.dropdown-button {
  width: 300px;
}

.drinks-container {
  width: 300px;
}

.drink-image {
  width: 90px;
  height: 90px;
  margin: 3px;
  border-radius: 5px;
  border: solid 2px white;
}
.drink-image:hover {
  cursor: pointer;
  border: solid 2px var(--el-color-primary);
}

.selected {
  border: solid 1px var(--el-color-primary);
}
</style>
