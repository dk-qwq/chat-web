import axios from 'axios';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useChatWsStore } from './chatws';

export const useUserStore = defineStore('user', () => {
    const userName = ref<string>('')

    const isLoggedIn = computed(() => !!userName.value)

    function setUser(name: string) {
        userName.value = name

        const chatWsStore = useChatWsStore()
        chatWsStore.setUserName(name)
        chatWsStore.connect()
    }
    function clearUser() {
        userName.value = ''
    }

    async function fetchMe() {
        try {
            const response = await axios.get('/api/me')

            setUser(response.data.user_name);
        } catch (error) {
            clearUser();
        }
    }

    return { userName, isLoggedIn, setUser, clearUser, fetchMe };
})