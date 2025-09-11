import { useUserStore } from '~/store/user'

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const user = useUserStore()
  const token = useCookie('factoryToken')

  if (token.value) {
    try {
      await user.getUserInfo()
    }
    catch {
      // handle error silently
    }
  }

  // The /guide routes have been removed, so these checks are no longer necessary.
  // if (to.path.startsWith('/guide/') && !token.value)
  //   return navigateTo('/login')
  //
  // if (to.path === '/guide/add' && !user.permissions?.includes(68))
  //   return navigateTo('/')
  //
  // if (to.path.startsWith('/guide/edit') && !user.permissions?.includes(69))
  //   return navigateTo('/')
})
