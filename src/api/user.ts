import service from "../utils/axios-instance";
import type { UserInfo, LoginData, UpdateUserInfo, UpdateUserInfoResult } from "../utils/types";

// 注册
export function register(userInfo: UserInfo): Promise<LoginData> {
  return service({
    method: 'POST',
    url: '/users/register',
    data: userInfo
  })
}

// 登录
export function login(userInfo: UserInfo): Promise<LoginData>{
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

// 修改信息
export function updateUserInfo(updateInfo: UpdateUserInfo): Promise<UpdateUserInfoResult> {
  return service({
    method: 'POST',
    url: '/users/updateInfo',
    data: updateInfo
  })
}