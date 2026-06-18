import axios from 'axios';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useChatStore } from './chat';
import { API_CONFIG } from '@/constants/api';

export const useUserStore = defineStore('user', () => {
    const userName = ref<string>('')

    const isLoggedIn = computed(() => !!userName.value)

    function setUser(name: string) {
        userName.value = name

        const chatStore = useChatStore()
        void chatStore.initchat(userName.value)
    }
    function clearUser() {
        userName.value = ''
    }

    async function fetchMe() {
        try {
            const response = await axios.get('/api/me', { timeout: API_CONFIG.TIMEOUT })

            setUser(response.data.user_name);
        } catch (error) {
            clearUser();
        }
    }

    return { userName, isLoggedIn, setUser, clearUser, fetchMe };
})