import service from "../utils/axios-instance";
import type { userInfo, gameQuestion, gameResult, recogResult, loginData, response } from "../utils/types";

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