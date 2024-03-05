import { defineStore } from 'pinia';
import { $axios } from '../modules/axios';
import { ElNotification } from 'element-plus';
import { showErrorToast } from '../modules/errorToast';

export const orderStore = defineStore('orderStore', {
  actions: {
    async createOrder(order) {
      try {
        const request = {
          menu: order,
        };
        await $axios.post('orders', request);
        ElNotification({
          message: 'Order created succesfully',
          duration: 5000,
          type: 'success',
        });
      } catch (error) {
        showErrorToast(error);
      }
    },
  },
});
