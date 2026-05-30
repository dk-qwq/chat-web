<template>
    <div class="msg-row" :class="'msg-' + getMessageDir(msg)">
        <div class="avatar" :class="'avatar-' + getMessageDir(msg)">{{ msg.userId[0] }}</div>
        <div class="msg-body">
            <span class="sender">{{ msg.userId }}</span>
            <div class="bubble">{{msg.content}}</div>
            <span class="time">{{formatTimestamp(msg.timestamp)}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">

import type { Message } from '@/type/message';
import { formatTimestamp } from '@/type/message';

const { 
    message: msg,
    userId
} = defineProps(['message', 'userId'])

const isMe = (message: Message): boolean => {
    return message.userId == userId;
}

const getMessageDir = (message: Message): string => {
    return isMe(message) ? "right" : "left";
}

</script>

<style scoped>
/* ========== 消息行（左右布局） ========== */
.msg-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 18px;
    animation: fadeUp 0.3s ease both;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 左侧消息：头像在左，内容在右（默认） */
.msg-left {
    flex-direction: row;
}

/* 右侧消息：头像在右，内容在左（反转） */
.msg-right {
    flex-direction: row-reverse;
}

/* ========== 头像 ========== */
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    user-select: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.avatar-left {
    background: linear-gradient(135deg, #a8c0ff, #8f94fb);
}

.avatar-right {
    background: linear-gradient(135deg, #f7971e, #ffd200);
    color: #5a3e00;
}

/* ========== 消息主体（包含昵称、气泡、时间） ========== */
.msg-body {
    display: flex;
    flex-direction: column;
    max-width: 70%;
}

/* ========== 昵称 ========== */
.sender {
    font-size: 12px;
    margin-bottom: 4px;
    padding: 0 4px;
    color: #8e8e9a;
}

.msg-right .sender {
    text-align: right;
    color: #b0b8d1;
}

/* ========== 气泡通用 ========== */
.bubble {
    position: relative;
    padding: 10px 16px;
    font-size: 15px;
    line-height: 1.5;
    word-break: break-word;
    border-radius: 18px;
    transition: box-shadow 0.25s, transform 0.25s;
}

/* ---------- 左侧气泡 ---------- */
.msg-left .bubble {
    background: #ffffff;
    color: #1a1a2e;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-top-left-radius: 4px;
    /* 小尾巴侧收窄 */
}

.msg-left .bubble::before {
    content: '';
    position: absolute;
    left: -7px;
    top: 12px;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 8px solid #ffffff;
    filter: drop-shadow(-1px 1px 1px rgba(0, 0, 0, 0.04));
}

/* ---------- 右侧气泡 ---------- */
.msg-right .bubble {
    background: linear-gradient(135deg, #667eea 0%, #5a6cf0 40%, #4f6ef7 100%);
    color: #ffffff;
    box-shadow: 0 2px 10px rgba(79, 110, 247, 0.25);
    border-top-right-radius: 4px;
}

.msg-right .bubble::after {
    content: '';
    position: absolute;
    right: -7px;
    top: 12px;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 8px solid #556df2;
    filter: drop-shadow(1px 1px 1px rgba(79, 110, 247, 0.2));
}

/* ========== 时间 ========== */
.time {
    font-size: 11px;
    margin-top: 5px;
    padding: 0 4px;
    color: #999;
}

.msg-right .time {
    text-align: right;
    color: #b0b8d1;
}
</style>
