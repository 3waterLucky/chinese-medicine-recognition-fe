import service from "../utils/axios-instance";
import type { userInfo, loginData } from "../utils/types";

// 注册
export function register(userInfo: userInfo): Promise<loginData> {
  return service({
    method: 'POST',
    url: '/users/register',
    data: userInfo
  })
}

// 登录
export function login(userInfo: userInfo): Promise<loginData>{
  return service({
    method: 'POST',
    url: '/users/login',
    data: userInfo
  })
}

// 退出登录
export function logout() {
  return service({
    method: 'POST',
    url: '/users/logout'
  })
}
