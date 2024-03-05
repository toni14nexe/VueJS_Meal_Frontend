<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { menuStore } from '../stores/menuStore';
import { router } from '../main';
import HorizontalLine from './HorizontalLine.vue';
import AirplaneIcon from '../assets/AirplaneIcon.vue';
import {
  RemoveFilled,
  CirclePlusFilled,
  ArrowDown,
  ArrowUp,
} from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { orderStore } from '../stores/orderStore';

const storeMenu = menuStore();
const storeOrder = orderStore();
const menusData = ref();
const isLoading = ref(true);
const selectedFilters = ref([]);
const selectedPassenger = ref('Passenger 1');
const query = ref({
  page: Number(router.currentRoute.value.query.page) || 1,
  perPage: Number(router.currentRoute.value.query.perPage) || 10,
  sort: router.currentRoute.value.query.sort || 'desc',
  sortBy: router.currentRoute.value.query.sortBy || 'title',
});
const orders = ref([
  {
    passenger: 'Passenger 1',
  },
  {
    passenger: 'Passenger 2',
  },
]);
const filters = ref([
  { title: 'Pork', value: 'pork' },
  { title: 'Seafood', value: 'seafood' },
  { title: 'Chicken', value: 'chicken' },
  { title: 'Beef', value: 'beef' },
  { title: 'Vegeterian', value: 'vegeterian' },
  { title: 'Celebrate on board', value: 'celebrate' },
  { title: 'Kosher', value: 'kosher' },
  { title: 'Kids menu', value: 'kids' },
  { title: 'Breakfast', value: 'breakfast' },
]);
const sortByOptions = [
  { name: 'Title', value: 'title' },
  { name: 'Type', value: 'type' },
  { name: 'Price', value: 'price' },
  { name: 'Newest', value: 'createdAt' },
];

onMounted(() => {
  if (router.currentRoute.value.query.filter === null)
    selectedFilters.value = [];
  else
    selectedFilters.value = router.currentRoute.value.query.filter.split(',');
  setQuery();
});

function setQuery() {
  router
    .replace({
      query: {
        page: query.value.page,
        perPage: query.value.perPage,
        filter: selectedFilters.value.length
          ? selectedFilters.value.join(',')
          : null,
        sort: query.value.sort,
        sortBy: query.value.sortBy,
      },
    })
    .then(() => getMenus());
}

function getMenus() {
  isLoading.value = true;
  storeMenu
    .getMenus({ ...query.value, filter: selectedFilters.value })
    .then((response) => {
      menusData.value = response?.data;
      menusData.value?.data.forEach((menu) => {
        if (menu.drink.length) menu.selectedDrink = menu.drink[0];
      });
    })
    .catch((error) => console.error(error))
    .finally(() => (isLoading.value = false));
}

function setFilter(filterValue) {
  if (filterValue === '') selectedFilters.value = [];
  else {
    const index = selectedFilters.value.indexOf(filterValue);

    if (index === -1) selectedFilters.value.push(filterValue);
    else selectedFilters.value.splice(index, 1);
  }

  setQuery();
}

const isFilterSelected = computed(() => {
  return (filterValue) => selectedFilters.value.includes(filterValue);
});

function getMenuDescription(menu) {
  let mealCount = 1;
  if (menu.starter) mealCount++;
  if (menu.desert) mealCount++;
  let menuDescription = `${mealCount} course meal`;

  const drinkAvailable = menu.drink.length ? true : false;
  if (drinkAvailable) return (menuDescription += ' + drink');
  return menuDescription;
}

function menuSelect(menu) {
  const order = {
    menuId: menu.id,
    menuTitle: menu.title,
    starter: menu.starter || null,
    desert: menu.desert || null,
    price: menu.price,
    menuImageUrl: menu.imageUrl,
    drinkId: menu.selectedDrink?.id || null,
    drinkTitle: menu.selectedDrink?.title || null,
    drinkImageUrl: menu.selectedDrink?.imageUrl || null,
  };

  const orderIndex = orders.value.findIndex(
    (order) => order.passenger === selectedPassenger.value
  );
  if (orderIndex !== -1)
    orders.value[orderIndex] = { ...orders.value[orderIndex], ...order };
}

function getBigPrice(price) {
  return String(Number(price).toFixed(2)).split('.')[0];
}

function getSmallPrice(price) {
  return String(Number(price).toFixed(2)).split('.')[1];
}

function addPassenger() {
  if (orders.value.length <= 4)
    orders.value.push({
      passenger: `Passenger ${orders.value.length + 1}`,
    });
  else
    ElNotification({
      message: 'Maximum number of passengers reached',
      duration: 5000,
      type: 'error',
    });
}

function removePassenger() {
  if (orders.value.length > 1) orders.value.pop();
  else
    ElNotification({
      message: "Can't remove last passenger",
      duration: 5000,
      type: 'error',
    });
}

const totalBigPrice = computed(() => {
  const override = orders.value.reduce((total, order) => {
    return total + (Number(String(order.price).split('.')[1]) || 0);
  }, 0);
  let bigTotal = orders.value.reduce((total, order) => {
    return total + (Number(String(order.price).split('.')[0]) || 0);
  }, 0);
  if (override > 100) bigTotal += override / 100;
  return bigTotal.toFixed(0);
});

const totalSmallPrice = computed(() => {
  let smallTotal = orders.value.reduce((total, order) => {
    return total + (Number(String(order.price).split('.')[1]) || 0);
  }, 0);
  if (smallTotal > 100) smallTotal = smallTotal % 100;
  return String(smallTotal).length === 1
    ? `0${String(smallTotal)}`
    : smallTotal;
});

const allOrdersHaveMenuId = computed(() => {
  return orders.value.every((order) => order.menuId);
});

function submitOrder() {
  if (orders.value.length && allOrdersHaveMenuId.value) {
    storeOrder.createOrder(orders.value);
    selectedPassenger.value = 'Passenger 1';
    orders.value = [{ passenger: 'Passenger 1' }, { passenger: 'Passenger 2' }];
  } else
    ElNotification({
      message: 'Something went wrong',
      duration: 5000,
      type: 'error',
    });
}

function sortByChangeHandler(sortByValue) {
  if (sortByValue !== query.value.sortBy) {
    query.value.sortBy = sortByValue;
    query.value.page = 1;
    setQuery();
  }
}

function sortChangeHandler(sortValue) {
  if (sortValue !== query.value.sort) {
    query.value.sort = sortValue;
    query.value.page = 1;
    setQuery();
  }
}

watch(
  () => [query.value.page, query.value.perPage],
  () => window.scrollTo({ top: 0, behavior: 'smooth' })
);
</script>

<template>
  <div v-if="isLoading" class="card-container mb-8">
    <div style="padding: 30px">
      <el-skeleton :rows="1" animated class="mt-4 mb-8" />
      <div v-for="skeleton in query.perPage">
        <el-skeleton class="mb-8" animated>
          <template #template>
            <el-row>
              <el-col :span="6">
                <el-skeleton-item class="menu-card-image" variant="image" />
              </el-col>
              <el-col :span="18">
                <el-skeleton :rows="4" animated class="mt-4 mb-8" />
              </el-col>
            </el-row>
          </template>
        </el-skeleton>
      </div>
      <el-skeleton :rows="1" animated class="mt-4 mb-8" />
    </div>
  </div>

  <div v-else class="card-container mb-8">
    <div class="card-wrapper">
      <el-space>
        <el-tag
          :effect="!selectedFilters.length ? 'dark' : 'plain'"
          @click="setFilter('')"
        >
          <h4>All</h4>
        </el-tag>

        <el-tag
          v-for="filter in filters"
          :effect="isFilterSelected(filter.value) ? 'dark' : 'plain'"
          :class="{ 'el-tag-revert': isFilterSelected(filter.value) }"
          @click="setFilter(filter.value)"
        >
          <h4>{{ filter.title }}</h4>
        </el-tag>
      </el-space>

      <el-row justify="end" class="mt-4" align="middle">
        <span class="menu-card-small-text zinc-text mr-2">Sort by:</span>
        <el-tag
          v-for="option in sortByOptions"
          class="mr-2"
          :class="{ 'cursor-not-allowed': query.sortBy === option.value }"
          :effect="query.sortBy === option.value ? 'dark' : 'plain'"
          @click="sortByChangeHandler(option.value)"
        >
          <h4>{{ option.name }}</h4>
        </el-tag>

        <span class="menu-card-small-text zinc-text ml-4 mr-2">Sort:</span>
        <el-tag
          class="mr-2"
          :class="{ 'cursor-not-allowed': query.sort === 'desc' }"
          :effect="query.sort === 'desc' ? 'dark' : 'plain'"
          @click="sortChangeHandler('desc')"
        >
          <el-icon :class="{ 'cursor-not-allowed': query.sort === 'desc' }">
            <ArrowDown />
          </el-icon>
        </el-tag>
        <el-tag
          class="mr-2"
          :class="{ 'cursor-not-allowed': query.sort === 'asc' }"
          :effect="query.sort === 'asc' ? 'dark' : 'plain'"
          @click="sortChangeHandler('asc')"
        >
          <el-icon :class="{ 'cursor-not-allowed': query.sort === 'asc' }">
            <ArrowUp />
          </el-icon>
        </el-tag>
      </el-row>

      <HorizontalLine />

      <div class="menu-card" v-for="menu in menusData?.data">
        <el-row>
          <el-image class="menu-card-image" :src="menu.imageUrl" fit="fill" />
          <div class="menu-card-text-container">
            <span class="menu-card-small-text zinc-text">
              {{ getMenuDescription(menu) }}
            </span>
            <br />
            <span class="text-bold">{{ menu.title }}</span> <br />
            <div v-if="menu.starter">
              <span class="menu-card-small-text text-bold"> Starter: </span>
              <span class="menu-card-small-text zinc-text">
                {{ menu.starter }}
              </span>
              <br />
            </div>
            <div v-if="menu.desert">
              <span class="menu-card-small-text text-bold"> Desert: </span>
              <span class="menu-card-small-text zinc-text">{{
                menu.desert
              }}</span>
              <br />
            </div>
            <span
              v-if="menu.drink.length"
              class="menu-card-small-text text-bold"
            >
              Selected drink:
            </span>
            <span
              v-if="menu.drink.length"
              class="menu-card-small-text zinc-text"
            >
              {{ menu.selectedDrink.title }}
            </span>
            <br />
            <div class="menu-card-drink-images-container">
              <div v-if="menu.drink.length">
                <el-image
                  v-for="drink in menu.drink"
                  class="menu-card-drink-image"
                  :class="{
                    'selected-drink': menu.selectedDrink.title === drink.title,
                  }"
                  :src="drink.imageUrl"
                  fit="fill"
                  @click="menu.selectedDrink = drink"
                />
              </div>
              <span v-else></span>
              <div class="price-select-wrapper">
                <span class="text-bold">{{ getBigPrice(menu.price) }}</span>
                <sup class="small-price text-bold">
                  {{ getSmallPrice(menu.price) }}
                </sup>
                €
                <br />
                <el-button @click="menuSelect(menu)" class="mt-2">
                  Select
                </el-button>
              </div>
            </div>
          </div>
        </el-row>
        <HorizontalLine />
      </div>

      <el-row justify="center">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.perPage"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next"
          :total="menusData.total"
          @size-change="setQuery"
          @current-change="setQuery"
        />
      </el-row>
    </div>
  </div>

  <el-affix :offset="50" class="affix">
    <el-row class="ml-4 mb-2">
      <AirplaneIcon style="width: 25px; height: 25px" />
      <span class="text-bold ml-2">Select meal</span>
    </el-row>
    <div class="affix-container">
      <el-row class="affix-field">
        <div>Riga - St Petersburg</div>
        <div class="menu-card-small-text zinc-text">
          Flight duration: 3h 40min
        </div>
      </el-row>
      <el-row
        v-for="order in orders"
        class="affix-field"
        justify="space-between"
        :class="{ 'selected-passenger': selectedPassenger === order.passenger }"
        @click="selectedPassenger = order.passenger"
      >
        <div class="menu-card-small-text">{{ order.passenger }}</div>
        <el-tooltip
          effect="light"
          placement="top"
          :content="`Menu: ${order.menuTitle}`"
          :disabled="!order.menuId"
        >
          <div
            class="menu-card-small-text zinc-text"
            :class="{ 'selected-order': order.menuId }"
          >
            {{
              order.menuId
                ? 'Selected'
                : selectedPassenger === order.passenger
                ? 'Select'
                : 'Not selected'
            }}
          </div>
        </el-tooltip>
      </el-row>
    </div>
    <el-row class="mt-2" justify="end">
      <el-tooltip
        effect="light"
        placement="bottom"
        content="Remove last passenger"
      >
        <el-icon :size="25" class="primary-icon" @click="removePassenger">
          <RemoveFilled />
        </el-icon>
      </el-tooltip>
      <el-tooltip effect="light" placement="bottom" content="Add passenger">
        <el-icon :size="25" class="primary-icon ml-2" @click="addPassenger">
          <CirclePlusFilled />
        </el-icon>
      </el-tooltip>
    </el-row>
    <el-row>
      <div class="menu-card-small-text ml-4 mt-2">
        Total for all passengers:
      </div>
      <span class="text-bold mt-1 ml-2">{{ totalBigPrice }}</span>
      <sup class="small-price text-bold mt-1">{{ totalSmallPrice }}</sup>
      <span class="mt-1 ml-2">€</span>
    </el-row>
    <el-row justify="center">
      <el-tooltip
        effect="light"
        placement="bottom"
        content="Must select menu for all passengers"
        :disabled="allOrdersHaveMenuId"
      >
        <el-button
          :disabled="!allOrdersHaveMenuId"
          class="mt-2"
          @click="submitOrder"
        >
          Submit
        </el-button>
      </el-tooltip>
    </el-row>
  </el-affix>
</template>

<style scoped>
.card-container {
  width: 80%;
  background-color: white;
  border-radius: 5px;
}

.card-wrapper {
  padding: 1rem;
}

.menu-card {
  width: 100%;
}

.menu-card-image {
  width: 12rem;
  height: 12rem;
  border-radius: 5px;
}

.menu-card-text-container {
  margin: 0 3% 0 3%;
  width: 74%;
  text-align: left;
}

.menu-card-small-text {
  font-size: small;
}

.menu-card-drink-images-container {
  display: flex;
  align-items: ceter;
  justify-content: space-between;
  height: 10%;
  width: 100%;
}

.menu-card-drink-image {
  margin: 0.5rem 0.5rem 0 0;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 5px;
  border: solid 1px rgba(255, 255, 255, 1);
}
.menu-card-drink-image:hover {
  border: solid 1px var(--el-color-primary);
  cursor: pointer;
}

.selected-drink {
  border: solid 1px var(--el-color-primary);
  cursor: not-allowed;
}

.price-select-wrapper {
  height: 4.5rem;
}

.small-price {
  font-size: x-small;
}

.affix {
  width: 20%;
}

.affix-container {
  margin-left: 1rem;
  background-color: white;
  border-radius: 5px;
}

.affix-field {
  padding: 10px 20px;
  border: solid 1px var(--el-color-primary);
  border-radius: 2px;
  cursor: pointer;
}
.affix-field:first-of-type {
  border-left: solid 5px var(--el-color-primary);
  cursor: not-allowed;
}
.selected-passenger {
  background-color: var(--el-color-primary-light-9);
}

.selected-order {
  color: var(--el-color-primary);
}

.primary-icon {
  transition: ease-in-out 0.3s;
  color: var(--el-color-primary);
}
.primary-icon:hover {
  cursor: pointer;
  color: var(--el-color-primary-light-3);
}

.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
