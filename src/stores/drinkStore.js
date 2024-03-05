import { defineStore } from 'pinia';
import { $axios } from '../modules/axios';
import { showErrorToast } from '../modules/errorToast';
import { ElNotification } from 'element-plus';

export const drinkStore = defineStore('drinkStore', {
  actions: {
    async getAllDrinks() {
      try {
        return await $axios.get('drinks');
      } catch (error) {
        showErrorToast(error);
      }
    },

    async createDrink(drinkData) {
      try {
        await $axios.post('drinks', drinkData);
        ElNotification({
          message: 'Drink created successfully',
          duration: 5000,
          type: 'success',
        });
      } catch (error) {
        showErrorToast(error);
      }
    },

    async updateDrink(drinkData) {
      try {
        await $axios.put(`drinks/${drinkData.id}`, {
          title: drinkData.title,
          imageUrl: drinkData.imageUrl,
        });
        ElNotification({
          message: 'Drink updated successfully',
          duration: 5000,
          type: 'success',
        });
      } catch (error) {
        showErrorToast(error);
      }
    },

    async deleteDrink(drinkId) {
      try {
        await $axios.delete(`drinks/${drinkId}`);
        ElNotification({
          message: 'Drink deleted successfully',
          duration: 5000,
          type: 'success',
        });
      } catch (error) {
        showErrorToast(error);
      }
    },
  },
});
