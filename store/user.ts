import { defineStore } from 'pinia'
import { getUserInfo as fetchUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as any,
    hasSetUserInfo: false,
  }),

  getters: {
    token: () => useCookie('factoryToken').value,
    userName: state => state.userInfo?.name,
    userId: state => state.userInfo?.id,
    permissions: state => state.userInfo?.permissions || [],
    selfUserType: state => state.userInfo?.self_user_type,
    accountBrandId: state => state.userInfo?.account_brand_id,
    accountBrandName: state => state.userInfo?.brand_name,
  },

  actions: {
    setToken(newToken: string) {
      const token = useCookie('factoryToken')
      token.value = newToken
    },

    setUserInfo(info: any) {
      this.userInfo = info
      this.hasSetUserInfo = true
    },

    async getUserInfo() {
      if (!this.token)
        return
      try {
        const res: any = await fetchUserInfo()
        this.setUserInfo(res)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    logout() {
      const token = useCookie('factoryToken')
      token.value = null
      this.userInfo = null
      this.hasSetUserInfo = false
      navigateTo('/')
    },
  },
})
