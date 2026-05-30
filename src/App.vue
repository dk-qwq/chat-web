<template>
  <ChatRoom />
  <AuthCard 
    v-if="showLogin"
    @close="showLogin = false"
  />
</template>

<script setup lang="ts">

import ChatRoom from './components/ChatRoom.vue';

import AuthCard from './components/AuthCard.vue';
import { ref } from 'vue';

const showLogin = ref<boolean>(true);

</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
</style>
