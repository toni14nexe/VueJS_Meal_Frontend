<script setup>
import { onBeforeMount } from 'vue';
import { checkAdminAuthorization } from '../../modules/authorization';
import BackofficeLayout from '../../layouts/BackofficeLayout.vue';

onBeforeMount(() => checkAdminAuthorization());
</script>

<template>
  <BackofficeLayout></BackofficeLayout>
</template>
