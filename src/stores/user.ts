import { defineStore } from 'pinia';
import {ref, computed} from 'vue';

export const useUserStore = defineStore('user', () => {
    const userId = ref<string>('')

    const isLoggedIn = computed(() => !!userId.value)

    function setUser(id :string) {
        userId.value = id
    }
    function clearUser() {
        userId.value = ''
    }

    return {userId, isLoggedIn, setUser, clearUser};
})