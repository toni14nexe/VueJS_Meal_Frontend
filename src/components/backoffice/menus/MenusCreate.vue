<script setup>
import { ref, computed, onMounted } from 'vue';
import { menuStore } from '../../../stores/menuStore';
import { drinkStore } from '../../../stores/drinkStore';
import { ArrowDown } from '@element-plus/icons-vue';

const storeMenu = menuStore();
const storeDrink = drinkStore();
const menuData = ref({
  title: '',
  type: null,
  starter: null,
  desert: null,
  price: 0,
  imageUrl: '',
  drink: [],
});
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
const drinkOptions = ref();

onMounted(() =>
  storeDrink
    .getAllDrinks()
    .then((response) => (drinkOptions.value = response.data))
);

const isValid = computed(() => {
  if (
    menuData.value.title.length > 3 &&
    menuData.value.type &&
    menuData.value.imageUrl.length > 7 &&
    menuData.value.price > 0 &&
    menuData.value.drink.length <= 3
  )
    return true;
  return false;
});

function imageSelectHandler(drinkData) {
  const alreadyExist = menuData.value.drink.some(
    (drink) => drink.id === drinkData.id
  );
  if (alreadyExist)
    menuData.value.drink = menuData.value.drink.filter(
      (drink) => drink.id !== drinkData.id
    );
  else if (menuData.value.drink.length < 3)
    menuData.value.drink.push(drinkData);
}

function create() {
  if (!menuData.value.starter?.length) menuData.value.starter = null;
  if (!menuData.value.desert?.length) menuData.value.desert = null;
  if (isValid.value)
    storeMenu.createMenu(menuData.value).then(() => {
      menuData.value = {
        title: '',
        type: null,
        starter: null,
        desert: null,
        price: 0,
        imageUrl: '',
        drink: [],
      };
    });
}
</script>

<template>
  <div class="mt-4">
    <el-row justify="center" class="row">Title</el-row>
    <el-row justify="center">
      <el-input class="input" v-model="menuData.title" placeholder="Title" />
    </el-row>
    <el-row justify="center" class="row">Type</el-row>
    <el-row justify="center">
      <el-dropdown>
        <el-button class="dropdown-button" type="primary" plain>
          {{ menuData?.type || 'Select type' }}
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="menuType in types"
              @click="menuData.type = menuType"
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
        v-model="menuData.starter"
        placeholder="Starter"
      />
    </el-row>
    <el-row justify="center" class="row">Desert</el-row>
    <el-row justify="center">
      <el-input class="input" v-model="menuData.desert" placeholder="Desert" />
    </el-row>
    <el-row justify="center" class="row">Price</el-row>
    <el-row justify="center">
      <el-input-number
        class="input"
        v-model="menuData.price"
        placeholder="Price"
        :precision="2"
        :step="0.01"
      />
    </el-row>
    <el-row justify="center" class="row">Image URL</el-row>
    <el-row justify="center">
      <el-input
        class="input"
        v-model="menuData.imageUrl"
        placeholder="Image URL"
      />
    </el-row>
    <el-row justify="center" class="row">
      <el-image class="image" :src="menuData.imageUrl" fit="fill" />
    </el-row>
    <el-row justify="center" class="row">Choose drinks</el-row>
    <el-row justify="center" class="row">
      <div class="drinks-container">
        <el-tooltip
          v-for="drink in drinkOptions"
          effect="light"
          placement="top"
          :content="
            menuData.drink.length <= 2 ? drink.title : 'Maximum drinks selected'
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
      {{ `Selected drinks - ${menuData.drink.length}/3` }}
    </el-row>
    <el-row justify="center" class="row">
      <div v-if="menuData.drink.length" class="drinks-container">
        <el-tooltip
          v-for="drink in menuData.drink"
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
  width: 300px;
  max-width: 300px;
}

.image {
  width: 150px;
  height: 150px;
  border-radius: 5px;
}

.dropdown-button {
  width: 300px !important;
  min-width: 300px;
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
