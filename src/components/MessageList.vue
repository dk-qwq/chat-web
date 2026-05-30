<template>
    <div class="message - list">
        <MessageItem
            v-for="msg in messages"
            :message="msg"
            :userId = "userId"
            :key="msg.timestamp"
        />
    </div>
</template>

<script setup lang="ts">

import MessageItem from './MessageItem.vue';
import type { Message } from '@/type/message';

import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const { userId } = storeToRefs(useUserStore())

defineProps<{
    messages: Message[]
}>()

</script>

<style scoped></style>
