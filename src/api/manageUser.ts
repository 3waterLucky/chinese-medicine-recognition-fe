import service from "../utils/axios-instance"
import type { Response, UserList, UserInfo } from "../utils/types"
import { md5 } from "js-md5"

// 获取用户列表
export function getUserList(): Promise<UserList> {
  return service({
    method: 'GET',
    url: '/users/list'
  })
}

// 删除用户
export function deleteUser(userId: number): Promise<Response> {
  return service({
    method: 'DELETE',
    url: '/users/delete',
    data: { userId }
  })
}

// 判断是否有重复账号
export function checkAccount(account: string): Promise<Response> {
  return service({
    method: 'POST',
    url: '/users/checkAccount',
    data: { account }
  })
}

// 添加用户
export function addUser(userInfo: UserInfo): Promise<Response> {
  userInfo.pwd = md5(userInfo.pwd)
  return service({
    method: 'POST',
    url: '/users/add',
    data: userInfo
  })
}

// 重置用户密码为123456
export function resetPwd(userId: number): Promise<Response> {
  return service({
    method: 'POST',
    url: '/users/resetPwd',
    data: { 
      userId,
      pwd: md5('123456')
    }
  })
}