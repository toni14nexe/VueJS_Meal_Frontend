<script setup>
import { onMounted, ref, watch } from 'vue';
import { menuStore } from '../../../stores/menuStore';
import HorizontalLine from '../../HorizontalLine.vue';

const storeMenu = menuStore();
const menus = ref([]);
const isLoading = ref(true);
const pagination = ref({
  page: 1,
  perPage: 10,
  total: 0,
});

onMounted(() => getMenus());

function getMenus() {
  isLoading.value = true;
  storeMenu
    .getMenus({
      page: pagination.value.page,
      perPage: pagination.value.perPage,
      sort: 'desc',
      sortBy: 'title',
    })
    .then((response) => {
      menus.value = response.data?.data;
      pagination.value.total = response.data?.total;
      isLoading.value = false;
    });
}

function getDateTime(dateTime) {
  const isoDateTime = new Date(dateTime);
  return `${isoDateTime.toLocaleDateString()} at ${isoDateTime.toLocaleTimeString()}`;
}

watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => window.scrollTo({ top: 0, behavior: 'smooth' })
);
</script>

<template>
  <div v-if="!isLoading">
    <div v-for="menu in menus">
      <HorizontalLine />
      <el-row>
        <el-col :span="4">
          <el-image class="image" :src="menu?.imageUrl" fit="fill" />
        </el-col>
        <el-col :span="1" />
        <el-col :span="19">
          <el-row class="ml-4 font-weight-5">{{ menu.title }}</el-row>
          <el-row class="ml-4 font-weight-5">
            <span class="zinc-text mr-2">Type: </span>
            {{ menu.type }}
          </el-row>
          <el-row class="ml-4 font-weight-5">
            <span class="zinc-text mr-2">Starter: </span>
            <span>{{ menu.starter ? menu.starter : '-' }}</span>
          </el-row>
          <el-row class="ml-4 font-weight-5">
            <span class="zinc-text mr-2">Desert: </span>
            <span>{{ menu.desert ? menu.desert : '-' }}</span>
          </el-row>
          <el-row class="ml-4 font-weight-5">
            <span class="zinc-text mr-2"> Drinks: </span>
            <span v-if="menu.drink.length" v-for="(drink, index) in menu.drink">
              <span>
                {{
                  `${drink.title}${menu.drink.length - 1 === index ? '' : ','}`
                }}
              </span>
            </span>
            <span v-else>-</span>
          </el-row>
          <el-row class="ml-4 zinc-text" text-small
            >{{ `ID: ${menu.id}` }}
          </el-row>
          <el-row class="ml-4 zinc-text text-small">
            {{ `Updated: ${getDateTime(menu.updatedAt)}` }}
          </el-row>
          <el-row class="ml-4 zinc-text text-small">
            {{ `Created: ${getDateTime(menu.createdAt)}` }}
          </el-row>
          <el-row class="ml-4 text-small text-align-left">
            <a :href="menu.imageUrl" target="_blank">{{ menu.imageUrl }}</a>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <HorizontalLine />
    <el-row justify="center">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.perPage"
        :page-sizes="[10, 20, 50, 100]"
        layout="sizes, prev, pager, next"
        :total="pagination.total"
        @size-change="getMenus"
        @current-change="getMenus"
      />
    </el-row>
  </div>
</template>

<style scoped>
.image {
  width: 150px;
  height: 150px;
  border-radius: 5px;
}
</style>
