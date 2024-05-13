import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userId = ref(0)
  const userName = ref('')
  const auth = ref(0)
  const setUser = (newUser: { userId: number, userName: string, auth: number }) => {
    userId.value = newUser.userId
    userName.value = newUser.userName
    auth.value = newUser.auth
  }
  const clearUser = () => {
    userId.value = 0
    userName.value = ''
    auth.value = 0
  }

  return { userId, userName, auth, setUser, clearUser }
})