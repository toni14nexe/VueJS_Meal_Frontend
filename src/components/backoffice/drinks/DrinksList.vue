<script setup>
import { onMounted, ref } from 'vue';
import { drinkStore } from '../../../stores/drinkStore';
import HorizontalLine from '../../HorizontalLine.vue';

const storeDrink = drinkStore();
const drinks = ref([]);
const isLoading = ref(true);

onMounted(() => {
  storeDrink.getAllDrinks().then((response) => {
    drinks.value = response.data;
    isLoading.value = false;
  });
});

function getDateTime(dateTime) {
  const isoDateTime = new Date(dateTime);
  return `${isoDateTime.toLocaleDateString()} at ${isoDateTime.toLocaleTimeString()}`;
}
</script>

<template>
  <div v-if="!isLoading">
    <div v-for="drink in drinks">
      <HorizontalLine />
      <el-row>
        <el-col :span="4">
          <el-image class="image" :src="drink.imageUrl" fit="fill" />
        </el-col>
        <el-col :span="1" />
        <el-col :span="19">
          <el-row class="ml-4 font-weight-5">{{ drink.title }}</el-row>
          <el-row class="ml-4 zinc-text" text-small
            >{{ `ID: ${drink.id}` }}
          </el-row>
          <el-row class="ml-4 zinc-text text-small">
            {{ `Updated: ${getDateTime(drink.updatedAt)}` }}
          </el-row>
          <el-row class="ml-4 text-small text-align-left">
            <a :href="drink.imageUrl" target="_blank">{{ drink.imageUrl }}</a>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <HorizontalLine />
  </div>
</template>

<style scoped>
.image {
  width: 150px;
  height: 150px;
  border-radius: 5px;
}
</style>
