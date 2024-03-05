<script setup>
import { onBeforeMount } from 'vue';
import { checkAdminAuthorization } from '../../modules/authorization';

onBeforeMount(() => checkAdminAuthorization());
</script>

<template></template>
