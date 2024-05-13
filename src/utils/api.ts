import service from "./axios-instance";
import type { userInfo, gameQuestion, recogResult, loginData, response } from "./types";

// 识别图片
export function recognize(image: FormData): Promise<recogResult> {
  return service({
    method: 'POST',
    url: '/recog',
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: image
  })
}

// 获取识别准确率
export function getAccuracy(): Promise<{ accuracy: number }> {
  return service({
    method: 'GET',
    url: '/recog/accuracy'
  })
}

// 获取问题
export function getQuestion(): Promise<gameQuestion> {
  return service({
    method: 'GET',
    url: '/game/question'
  })
}

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
