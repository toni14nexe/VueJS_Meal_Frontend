<script setup>
import { onMounted, ref } from 'vue';
import { orderStore } from '../../../stores/orderStore';
import HorizontalLine from '../../HorizontalLine.vue';

const storeOrder = orderStore();
const orders = ref([]);
const isLoading = ref(true);

onMounted(() => getAllOrders());

function getAllOrders() {
  storeOrder.getAllOrders().then((response) => {
    orders.value = response.data.data;
    isLoading.value = false;
  });
}

function getDateTime(dateTime) {
  const isoDateTime = new Date(dateTime);
  return `${isoDateTime.toLocaleDateString()} at ${isoDateTime.toLocaleTimeString()}`;
}

function deleteOrder(orderId) {
  storeOrder.deleteOrder(orderId).then(() => getAllOrders());
}
</script>

<template>
  <div v-if="!isLoading" class="mt-4">
    <div v-for="order in orders" class="mt-4">
      <HorizontalLine />
      <el-row class="ml-6 zinc-text text-small" justify="space-between">
        <span>
          Passengers: {{ order.menu.length }} -
          {{ getDateTime(order.createdAt) }} - ID: {{ order.id }}
        </span>
        <span>
          <el-button type="danger" plain @click="deleteOrder(order.id)"
            >Delete</el-button
          >
        </span>
      </el-row>
      <div v-for="menu in order.menu" class="mt-4">
        <el-row>
          <el-col :span="4">
            <el-image class="menu-image" :src="menu.menuImageUrl" fit="fill" />
          </el-col>
          <el-col :span="1" />
          <el-col :span="19">
            <el-row>
              <span class="zinc-text text-small mb-2">
                {{ menu.passenger }}
              </span>
            </el-row>
            <el-row>{{ menu.menuTitle }}</el-row>
            <el-row v-if="menu.starter">
              <span class="zinc-text">Starter:</span>
              <span class="ml-2">{{ menu.starter }}</span>
            </el-row>
            <el-row v-if="menu.desert">
              <span class="zinc-text">Desert:</span>
              <span class="ml-2">{{ menu.desert }}</span>
            </el-row>
            <el-row v-if="menu.drinkTitle">
              <span class="zinc-text">Drink:</span>
              <span class="ml-2">{{ menu.drinkTitle }}</span>
            </el-row>
            <el-row v-else>
              <span class="zinc-text">No drink</span>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <HorizontalLine />
  </div>
</template>

<style scoped>
.menu-image {
  width: 100px;
  height: 100px;
  border-radius: 5px;
}
.drink-image {
  width: 50px;
  height: 50px;
  border-radius: 5px;
}
</style>
