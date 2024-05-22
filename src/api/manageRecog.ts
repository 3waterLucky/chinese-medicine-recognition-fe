import service from "../utils/axios-instance"
import type { RecogRecords, SevenDayData } from "../utils/types"

// 获取识别记录列表
export function getRecogRecords(): Promise<RecogRecords> {
  return service({
    method: 'GET',
    url: '/recog/record'
  })
}

// 获取近七日数据
export function getSevenDayData(): Promise<SevenDayData> {
  return service({
    method: 'GET',
    url: '/recog/sevenDayData'
  })
}