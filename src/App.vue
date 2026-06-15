<template>
  <ChatRoom />
  <AuthCard v-if="showLogin" @close="showLogin = false" />
</template>

<script setup lang="ts">

import ChatRoom from './components/ChatRoom.vue';

import AuthCard from './components/AuthCard.vue';
import { computed, ref } from 'vue';
import { useUserStore } from './stores/user.ts';

const showLogin = computed(() => !useUserStore().isLoggedIn)

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
