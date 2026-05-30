<template>
    <div class="chat-wrapper">
        <div class="chat-header">
            <h1 class="title">💬 聊天室</h1>
        </div>

        <div class="chat-body">
            <MessageList :messages="messageList" />
        </div>

        <!-- TODO remove id input -->
        <div class="chat-footer">
            <input v-model="content" type="text" placeholder="输入content" />
            <input v-model="id" type="text" placeholder="输入id" />
            <button @click="addMsg"> 发送 </button>
        </div>
    </div>
</template>

<script setup lang="ts">

import MessageList from './MessageList.vue';
import { ref } from 'vue';
import type { Message } from '@/type/message.ts';

const messageList = ref<Message[]>([]);

// TODO: del this
let msgId = 0
const content = ref<string>('')
const id = ref<string>('')

const addMsg = () => {
    console.log(content, id)
    if (!content.value || !id.value) {
        return
    }

    console.log(content.value, id.value)

    msgId++
    messageList.value.push({
        id: `${msgId}`,
        userId: id.value,
        userName: id.value,
        content: `${content.value}`,
        timestamp: Date.now()
    })
}

</script>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;           /* 撑满屏幕，也可以改成固定高度如 600px */
  max-width: 600px;
  margin: 0 auto;
  background: #f5f6fa;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-radius: 12px;
  overflow: hidden;        /* 圆角剪切 */
}

/* 头部 */
.chat-header {
  flex-shrink: 0;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  text-align: center;
}
.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

/* 消息滚动区 */
.chat-body {
  flex: 1;                 /* 占据剩余高度 */
  overflow-y: auto;        /* 内容多时滚动 */
  padding: 16px;
  /* 让滚动条好看点 */
  scroll-behavior: smooth;
}
.chat-body::-webkit-scrollbar {
  width: 5px;
}
.chat-body::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

/* 底部输入区 */
.chat-footer {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #eee;
}
.chat-footer input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}
.chat-footer button {
  padding: 8px 16px;
  background: #4f6ef7;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}
</style>