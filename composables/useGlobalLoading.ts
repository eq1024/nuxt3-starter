import { ref } from 'vue'

// Define a reactive variable for the loading state, shared across the application
const globalLoading = ref(false)

/**
 * Composable for managing a global loading indicator.
 *
 * @returns An object with a reactive `globalLoading` state,
 *          a `show` function to activate the loading indicator,
 *          and a `hide` function to deactivate it.
 */
export function useGlobalLoading() {
  /**
   * Activates the global loading indicator.
   */
  function show() {
    globalLoading.value = true
  }

  /**
   * Deactivates the global loading indicator.
   */
  function hide() {
    globalLoading.value = false
  }

  return {
    globalLoading,
    show,
    hide,
  }
}
