import type { Message } from "@/type/message";
import { defineStore } from "pinia";
import { ref } from "vue";

// public onmessage?: (event: MessageEvent) => void

export const useChatWsStore = defineStore('chatWs', () => {
    const ws = ref<WebSocket | null>(null)
    const connected = ref<boolean>(false)

    const messageList = ref<Message[]>([])

    const userName = ref<string>('')
    const setUserName = (name: string) => {
        userName.value = name
    }


    const connect = () => {
        console.log(ws.value)
        const state = ws.value?.readyState;
        if (state == WebSocket.CONNECTING || state == WebSocket.OPEN) return

        const url = "/api/ws"
        ws.value = new WebSocket(url)

        console.log(`Websocket ${url} connected`)

        ws.value.onopen = () => {
            connected.value = true
            console.log(`Websocket ${url} connected`)
        }

        ws.value.onmessage = (event: MessageEvent) => {
            console.log(`收到消息 ${event.data}`)

            try {
                const message = JSON.parse(event.data) as Message;
                messageList.value.push(message)
            } catch (e) {
                console.error("服务器数据包损坏", e);
            }
        }

        ws.value.onclose = () => {
            connected.value = false
            console.log(`Websocket closed`)
        }

        ws.value.onerror = (err) => {
            console.error(`WebSocket err:`, err)
        }
    }

    const disconnect = () => {
        ws.value?.close()
        ws.value = null
        connected.value = false
    }

    const sendMessage = (msg: string) => {
        if (ws.value?.readyState == WebSocket.OPEN) {
            const message: Message = {
                "id": "0",
                "user_name": userName.value,
                "content": msg,
                "timestamp": Date.now()
            }

            ws.value.send(JSON.stringify(message))

            console.log(`sendMessage: `, JSON.stringify(message))
        }
    }

    return { connected, messageList, setUserName, connect, disconnect, sendMessage }
})

