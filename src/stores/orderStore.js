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
          message: 'Order created successfully',
          duration: 5000,
          type: 'success',
        });
      } catch (error) {
        showErrorToast(error);
      }
    },

    async getAllOrders() {
      try {
        return await $axios.get('orders');
      } catch (error) {
        showErrorToast(error);
      }
    },
  },
});
