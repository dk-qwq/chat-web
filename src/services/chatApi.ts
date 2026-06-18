import { API_CONFIG } from "@/constants/api";
import type { Message } from "@/type/message";
import axios from "axios";

const FETCH_MESSAGE_SIZE: number = 20;

export async function fetchLatestMessage(): Promise<Message[]> {
    try {
        const response = await axios.get(`/api/messages`, {
            params: {
                limit: FETCH_MESSAGE_SIZE,
            },
            timeout: API_CONFIG.TIMEOUT,
        })

        return response.data.messages as Message[]
    } catch (error) {
        console.error(`拉取最新消息失败: `, error)

        return []
    }
}

export async function fetchLatestMessageId(): Promise<number> {
    try {
        const response = await axios.get(`/api/messages/meta`, {
            timeout: API_CONFIG.TIMEOUT,
        })

        return response.data.id
    } catch (error) {
        console.error(`拉取最新消息 id 失败: `, error)
        return -1
    }
}

export async function fetchMessageBefore(before_id: number): Promise<Message[]> {
    try {
        const response = await axios.get(`/api/messages`, {
            params: {
                limit: FETCH_MESSAGE_SIZE,
                before_id: before_id,
            },
            timeout: API_CONFIG.TIMEOUT,
        })

        return response.data.messages as Message[]
    } catch (error) {
        console.error(`拉取 before_id: ${before_id} 阶段消息失败: `, error)

        return []
    }
}

export async function fetchMessageAfter(after_id: number): Promise<Message[]> {
    try {
        const response = await axios.get(`/api/messages`, {
            params: {
                limit: FETCH_MESSAGE_SIZE,
                after_id: after_id,
            },
            timeout: API_CONFIG.TIMEOUT,
        })

        return response.data.messages as Message[]
    } catch (error) {
        console.error(`拉取 after_id: ${after_id} 阶段消息失败: `, error)

        return []
    }
}

