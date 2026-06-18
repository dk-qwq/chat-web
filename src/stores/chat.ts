import type { Message } from "@/type/message";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { ChatWebsocket } from "@/services/chatSocket";
import { mergeMessages } from "@/utils/message";
import { fetchLatestMessage, fetchLatestMessageId, fetchMessageAfter, fetchMessageBefore } from "@/services/chatApi";

export const useChatStore = defineStore('chat', () => {
    const ws = ref<ChatWebsocket | null>(null)
    const connected = ref<boolean>(false)

    const messageList = ref<Message[]>([])

    const latestMessageId = computed<number>(() => {
        return messageList.value?.at(-1)?.id ?? -1
    })

    const oldestMessageId = computed<number>(() => {
        return messageList.value?.at(0)?.id ?? -1
    })

    const userName = ref<string>('')

    const appendMessage = (message: Message) => {
        appendMessages([message])
    }

    const appendMessages = (messages: Message[]) => {
        messageList.value = mergeMessages(
            messageList.value,
            messages
        )
    }

    const loadNewerMessages = async (): Promise<boolean> => {
        if (latestMessageId.value == await fetchLatestMessageId()) {
            return false
        }

        const addMessages = await fetchMessageAfter(latestMessageId.value)
        appendMessages(addMessages)

        return addMessages.length != 0
    }

    const loadOlderMessages = async (): Promise<boolean> => {
        if (oldestMessageId.value == 1) {
            return false
        }

        const addMessages = await fetchMessageBefore(oldestMessageId.value)
        appendMessages(addMessages)

        return addMessages.length != 0
    }

    const loadHistory = async () => {
        appendMessages(await fetchLatestMessage())
    }

    const initchat = async (name: string) => {
        userName.value = name
        connect()
        await loadHistory()
    }

    const connect = () => {
        const url = "/api/ws"
        ws.value = new ChatWebsocket(url)

        ws.value.onopen = () => {
            connected.value = true
            console.log(`Websocket ${url} connected`)
        }

        ws.value.onmessage = (event: MessageEvent) => {
            console.log(`收到消息 ${event.data}`)

            try {
                const message = JSON.parse(event.data) as Message;
                appendMessage(message)
            } catch (e) {
                console.error("服务器数据包损坏", e);
            }
        }

        ws.value.onclose = () => {
            connected.value = false
            console.log(`Websocket closed`)
            reconnect()
        }

        ws.value.onerror = (err) => {
            console.error(`WebSocket err:`, err)
        }

        ws.value.connect()
    }

    const reconnect = () => {
        if (ws.value == null) return
        setTimeout(() => {
            ws.value?.connect()
        }, 3000);
    }

    const sendMessage = (msg: string) => {
        console.log("chat.ts: sendMessage:msg", msg)

        console.log("chat.ts: sendMessage:ws.value", ws.value)

        if (ws.value?.readyState == WebSocket.OPEN) {
            const message: Message = {
                "id": 0,
                "user_name": userName.value,
                "content": msg,
                "timestamp": Date.now()
            }

            ws.value.send(JSON.stringify(message))
        }
    }

    return { connected, messageList, initchat, connect, reconnect, sendMessage, loadOlderMessages, loadNewerMessages }
})

