import { defineStore } from 'pinia';
import { $axios } from '../modules/axios';
import { showErrorToast } from '../modules/errorToast';
import cookies from 'vue-cookies';
import { router } from '../main';

export const adminStore = defineStore('adminStore', {
  actions: {
    async login(adminData) {
      try {
        const response = await $axios.post('admin/login', adminData);
        cookies.set('authorization', `token ${response.data.token}`, '1h');
        router.push('/backoffice/dashboard');
      } catch (error) {
        showErrorToast(error);
      }
    },
  },
});
