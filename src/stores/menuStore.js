import { defineStore } from 'pinia';
import { $axios } from '../modules/axios';
import { showErrorToast } from '../modules/errorToast';

export const menuStore = defineStore('menuStore', {
  actions: {
    async getMenus(query) {
      try {
        return await $axios.get('menus', { params: query });
      } catch (error) {
        showErrorToast(error);
      }
    },
  },
});
