import { useUserStore } from '~/store/user'

type fetchType = typeof $fetch
type ReqType = Parameters<fetchType>[0]
type FetchOptions = Parameters<fetchType>[1]

export function useRequest<T = unknown>(
  request: ReqType,
  opt: FetchOptions = {},
) {
  const config = useRuntimeConfig()
  const token = useCookie('factoryToken')

  // Set the base URL dynamically based on the environment
  const baseURL = (import.meta.server ? config.apiBase : config.public.apiBase) as string

  const defaultOpt: FetchOptions = {
    baseURL,
    onResponseError({ response }) {
      if (response.status === 401) {
        const userStore = useUserStore()
        userStore.logout()
        ElMessage.error('登录已过期，请重新登录')
      }
      else {
        console.error('[Request Error]', response.status, response.body)
      }
    },
    onResponse({ response }) {
      const res = response._data as App.ApiResponse<T>
      if (res && res.code !== undefined && res.code !== 200) {
        console.error('Business logic error:', res.msg || res.message)
        ElMessage.error(res.msg || res.message || 'An unexpected error occurred.')
        // Reject the promise to propagate the error
        return Promise.reject(new Error(res.msg || res.message || 'Business Error'))
      }
      response._data = res.data
    },
    async onRequest({ options }) {
      if (options.method === 'get' || options.method === 'GET') {
        options.query = options.query || {}
      }
    },
  }

  if (token.value) {
    opt.headers = opt.headers || {}
    ;(opt.headers as any).authorization = token.value
  }

  const mergedOptions = useMerge(defaultOpt, opt)

  if (mergedOptions.method?.toLowerCase() === 'get') {
    mergedOptions.query = useMerge(mergedOptions.query, (mergedOptions as any).params)
    delete (mergedOptions as any).params
  }
  else {
    mergedOptions.body = mergedOptions.body || (mergedOptions as any).data
    delete (mergedOptions as any).data
  }

  console.log('请求参数', request)

  return $fetch<T>(request, mergedOptions).catch((error) => {
    console.error('[Fetch Catch Error]', request, error)
    // Re-throw the error so that the business code layer can catch it
    throw error
  })
}
