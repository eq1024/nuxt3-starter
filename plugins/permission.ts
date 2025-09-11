import { useUserStore } from '~/store/user'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('permission', {
    mounted(el, binding) {
      const { value } = binding
      const userStore = useUserStore()
      const { permissions, selfUserType, accountBrandName } = userStore

      const isDebug = binding.arg === 'debug'

      if (isDebug) {
        console.group(`v-permission debug for element:`, el)
        console.log('Directive value:', value)
        console.log('User Permissions:', permissions)
        console.log('User Type:', selfUserType)
        console.log('User Brand Name:', accountBrandName)
      }

      // if (selfUserType === 1) {
      //   if (isDebug) {
      //     console.log('Result: User is super admin (type 1), access granted.')
      //     console.groupEnd()
      //   }
      //   return
      // }

      if (value && Array.isArray(value) && value.length > 0) {
        const [requiredPermission, requiredUserType, requiredBrandName] = value
        let hasPermission = true
        let reason = ''

        if (requiredPermission !== undefined && requiredPermission !== null) {
          const permissionOk = (permissions as number[]).includes(requiredPermission)
          if (!permissionOk) {
            hasPermission = false
            reason = `Missing permission: required ${requiredPermission}`
          }
        }

        if (hasPermission && requiredUserType !== undefined && requiredUserType !== null) {
          if (Array.isArray(requiredUserType)) {
            if (!requiredUserType.includes(selfUserType)) {
              hasPermission = false
              reason = `User type mismatch: required one of ${requiredUserType}, but got ${selfUserType}`
            }
          }
          else {
            if (selfUserType !== requiredUserType) {
              hasPermission = false
              reason = `User type mismatch: required ${requiredUserType}, but got ${selfUserType}`
            }
          }
        }

        if (hasPermission && selfUserType !== 1 && requiredBrandName !== undefined && requiredBrandName !== null) {
          if (accountBrandName !== requiredBrandName) {
            hasPermission = false
            reason = `Brand name mismatch: required ${requiredBrandName}, but got ${accountBrandName}`
          }
        }

        if (isDebug) {
          if (hasPermission)
            console.log('Result: Access granted.')
          else
            console.log(`Result: Access denied. Reason: ${reason}`)

          console.groupEnd()
        }
        else if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
      else {
        if (isDebug) {
          console.error('Error: v-permission requires an array value.')
          console.groupEnd()
        }
        throw new Error('need roles! Like v-permission="[22, 1, \'some-brand\']" or v-permission="[22, 1]" or v-permission="[22]"')
      }
    },
  })
})
