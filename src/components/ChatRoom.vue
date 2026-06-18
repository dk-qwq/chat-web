<template>
    <div class="chat-wrapper">
        <div class="chat-header">
            <h1 class="title">💬 聊天室</h1>
        </div>

        <div class="chat-body">
            <MessageList ref="messageListRef" :messages="messageList" @load-newer-messages="loadNewerMsg"
                @load-older-messages="loadOlderMsg" />
        </div>

        <div class="chat-footer">
            <input v-model="content" type="text" placeholder="输入消息..." />
            <button @click="sendMsg"> 发送 </button>
        </div>
    </div>
</template>

<script setup lang="ts">

import MessageList from './MessageList.vue';
import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';
import { useChatStore } from '@/stores/chat.ts';
import { storeToRefs } from 'pinia';

const chatStore = useChatStore()

const { messageList } = storeToRefs(chatStore);

const content = ref<string>('')

const messageListRef = useTemplateRef<InstanceType<typeof MessageList>>('messageListRef')

const sendMsg = async () => {
    if (content.value.length == 0) {
        return
    }

    paddingScrollToBottom.value = true

    chatStore.sendMessage(content.value)
    content.value = ""
}

const scrollToBottomSync = async (behavior?: ScrollBehavior) => {
    await nextTick()
    messageListRef.value?.scrollToBottom(behavior)
}

const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

// TODO: fix scrollBottom where reload
// navEntry.type !== "reload"
const needInitialScroll = ref<boolean>(true)

const paddingScrollToBottom = ref<boolean>(false)



const loadOlderMsg = async () => {
    if (messageListRef.value == null) return
    if (messageList.value.length == 0) return

    const oldScrollTop = messageListRef.value.getScrollTop()
    const oldScrollHeight = messageListRef.value.getScrollHeight()

    await chatStore.loadOlderMessages()

    const newScrollHeight = messageListRef.value.getScrollHeight()
    messageListRef.value.scrollTo(
        oldScrollTop +
        (newScrollHeight - oldScrollHeight)
    )
}

const loadNewerMsg = () => {
    if (messageList.value.length == 0) return

    chatStore.loadNewerMessages()
}


watch(
    () => messageList.value.length,
    async (newLen, oldLen) => {
        if (needInitialScroll.value) {
            await scrollToBottomSync()
        } else if (paddingScrollToBottom.value || messageListRef.value?.getIsAtBottom()) {
            await scrollToBottomSync('smooth')
        }

        needInitialScroll.value = false
        paddingScrollToBottom.value = false
    },
    { flush: "post" }
)

</script>

<style scoped>
.chat-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    /* 撑满屏幕，也可以改成固定高度如 600px */
    max-width: 600px;
    margin: 0 auto;
    background: #f5f6fa;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    overflow: hidden;
    /* 圆角剪切 */
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
    flex: 1;
    min-height: 0;
    padding: 16px;
    padding-right: 5px;
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