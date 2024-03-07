import { defineStore } from 'pinia';
import { $axios } from '../modules/axios';
import { showErrorToast } from '../modules/errorToast';
import { ElNotification } from 'element-plus';

export const menuStore = defineStore('menuStore', {
  actions: {
    async getMenus(query) {
      try {
        return await $axios.get('menus', { params: query });
      } catch (error) {
        showErrorToast(error);
      }
    },

    async getAllMenus() {
      return await this.getMenus({
        page: 1,
        perPage: 1000,
        sort: 'desc',
        sortBy: 'title',
      });
    },

    async createMenu(menuData) {
      try {
        await $axios.post('menus', menuData);
        ElNotification({
          message: 'Menu created successfully',
          duration: 5000,
          type: 'success',
        });
      } catch (error) {
        showErrorToast(error);
      }
    },

    async updateMenu(menuData) {
      try {
        await $axios.put(`menus/${menuData.id}`, {
          title: menuData.title,
          type: menuData.type,
          starter: menuData.starter,
          desert: menuData.desert,
          price: menuData.price,
          imageUrl: menuData.imageUrl,
          drink: menuData.drink,
        });
        ElNotification({
          message: 'Menu updated successfully',
          duration: 5000,
          type: 'success',
        });
      } catch (error) {
        showErrorToast(error);
      }
    },

    async deleteMenu(menuId) {
      try {
        await $axios.delete(`menus/${menuId}`);
        ElNotification({
          message: 'Menu deleted successfully',
          duration: 5000,
          type: 'success',
        });
      } catch (error) {
        showErrorToast(error);
      }
    },
  },
});
