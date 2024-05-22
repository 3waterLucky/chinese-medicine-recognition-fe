import service from "../utils/axios-instance";
import type { RecogResult, Response } from "../utils/types";

// 识别图片
export function recognize(image: FormData): Promise<RecogResult> {
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

// 提交用户评价
export function submitEvaluate(data: { id: number, score: number }): Promise<Response> {
  return service({
    method: 'POST',
    url: '/recog/evaluate',
    data
  })
}