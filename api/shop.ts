import { useCurrencyStore } from '@/store/currency'

export function createCheckoutSession(shop_part_data: App.ShopPart[]) {
  const currencyStore = useCurrencyStore()
  return useRequest('/self-repair/shop-order/createCheckoutSession', {
    method: 'POST',
    body: {
      shop_part_data,
      sales_area: currencyStore.sales_area,
    },
  })
}

export function checkPartIsRemove(shop_part_data: App.ShopPart[]) {
  const currencyStore = useCurrencyStore()
  return useRequest('/self-repair/shop-order/checkPartIsRemove', {
    method: 'POST',
    body: {
      shop_part_data,
      sales_area: currencyStore.sales_area,
    },
  })
}

export function calculateShippingOptions(data: any) {
  return useRequest('/self-repair/shop-order/calculateShippingOptions', {
    method: 'POST',
    body: data,
  })
}
export function getPartsList(params?: any) {
  return useRequest('/self-repair/shop-part/selfRepairList', {
    method: 'GET',
    params,
  })
}
export function getCompletedData(params?: any) {
  return useRequest<App.CompletedOrder>('/self-repair/shop-order/details', {
    method: 'GET',
    params,
  })
}

export function toolBinding(data: any) {
  return useRequest('/self-repair/guides-release/toolBinding', {
    method: 'POST',
    body: data,
  })
}

export function partBinding(data: any) {
  return useRequest('/self-repair/guides-release/partBinding', {
    method: 'POST',
    body: data,
  })
}

export function deleteTool(id: any) {
  return useRequest(`/self-repair/guides-release/deleteTool/${id}`, {
    method: 'DELETE',
  })
}

export function deletePart(id: any) {
  return useRequest(`/self-repair/guides-release/deletePart/${id}`, {
    method: 'DELETE',
  })
}
