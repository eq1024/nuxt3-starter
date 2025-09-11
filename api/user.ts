export function login(data: any) {
  return useRequest('/user/login', {
    method: 'post',
    body: data,
  })
}

export function getCaptcha(params?: any) {
  return useRequest('/user/getCaptcha', {
    method: 'get',
    params,
  })
}

export function getUserInfo(_params?: any) {
  // Return mock user data directly
  return Promise.resolve({
    id: 1,
    name: 'testuser',
    account: 'testuser',
    email: 'testuser@example.com',
    permissions: [67, 68, 69], // Mock permissions to pass route guards
    self_user_type: 1,
    account_brand_id: 1,
    brand_name: 'MockBrand',
  })
}
