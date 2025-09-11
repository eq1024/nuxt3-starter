type LoadingName = string
const loadingStates = ref<Record<LoadingName, boolean>>({})

export function useLoading() {
  const start = (name: LoadingName) => {
    loadingStates.value = { ...loadingStates.value, [name]: true }
  }

  const stop = (name: LoadingName) => {
    loadingStates.value = { ...loadingStates.value, [name]: false }
  }

  const isLoading = (name: LoadingName) => {
    return loadingStates.value[name]
  }

  const withLoading = async <T>(name: LoadingName, fn: () => Promise<T>): Promise<T> => {
    start(name)
    try {
      return await fn()
    }
    finally {
      stop(name)
    }
  }

  return {
    start,
    stop,
    isLoading,
    withLoading,
    loadingStates,
  }
}
