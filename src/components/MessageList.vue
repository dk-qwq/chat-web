<template>
    <div ref="listRef" class="message-list">
        <div ref="topSentinel" class="sentinel"></div>
        <MessageItem v-for="msg in messages" :message="msg" :userName="userName" :key="msg.id" />
        <div ref="bottomSentinel" class="sentinel"></div>
    </div>

</template>

<script setup lang="ts">

import MessageItem from './MessageItem.vue';
import type { Message } from '@/type/message';

import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

const { userName } = storeToRefs(useUserStore())

interface Props {
    messages: Message[]
}

const { messages } = defineProps<Props>()

const topSentinel = ref(null);
const bottomSentinel = ref(null);

let observer: IntersectionObserver | null = null

const isAtBottom = ref<boolean>(false)

const getIsAtBottom = () => isAtBottom.value

const isScrollable = (): boolean => {
    if (!listRef.value) return false
    return listRef.value.scrollHeight
        > listRef.value.clientHeight
}

const getScrollHeight = (): number => {
    return listRef.value?.scrollHeight ?? 0;
}

const getScrollTop = (): number => {
    return listRef.value?.scrollTop ?? 0;
}

const emit = defineEmits(['loadOlderMessages', 'loadNewerMessages'])

onMounted(() => {
    observer = new IntersectionObserver((entries) => {
        // if (!isScrollable()) return
        entries.forEach((entry) => {
            if (entry.target == topSentinel.value) {
                if (entry.isIntersecting !== true) {
                    return
                }
                emit('loadOlderMessages')
            }
            if (entry.target == bottomSentinel.value) {
                isAtBottom.value = entry.isIntersecting
                if (entry.isIntersecting !== true) {
                    return
                }
                emit('loadNewerMessages')
            }
        })
    }, {
        root: listRef.value,
        threshold: 0.1,
    })

    if (topSentinel.value) observer.observe(topSentinel.value)
    if (bottomSentinel.value) observer.observe(bottomSentinel.value)
})

onUnmounted(() => {
    if (observer) observer.disconnect()
})

const listRef = useTemplateRef<HTMLDivElement>('listRef')

const scrollToTop = (behavior: ScrollBehavior = 'instant') => {
    if (listRef.value) {
        listRef.value.scrollTo({
            top: 0,
            behavior: behavior,
        })
    }
}

const scrollToBottom = (behavior: ScrollBehavior = 'instant') => {
    console.log("scroolToBottom")
    if (listRef.value) {
        listRef.value.scrollTo({
            top: listRef.value.scrollHeight,
            behavior: behavior,
        })
    }
}

const scrollTo = (height: number, behavior: ScrollBehavior = 'instant') => {
    if (listRef.value) {
        listRef.value.scrollTo({
            top: height,
            behavior: behavior,
        })
    }
}

defineExpose({
    scrollToTop,
    scrollToBottom,
    getIsAtBottom,
    isScrollable,
    getScrollHeight,
    getScrollTop,
    scrollTo,
})

</script>

<style scoped>
.message-list {
    height: 100%;
    overflow-y: auto;

}

.message-list::-webkit-scrollbar {
    width: 5px;
}

.message-list::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}

/* 哨兵元素设为透明且高度极小 */
.sentinel {
    height: 1px;
    background: transparent;
}
</style>