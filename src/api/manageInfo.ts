import service from "../utils/axios-instance"
import type { DetailMedList, Response } from "@/utils/types"

// 添加药品
export function addMedicine(data: FormData): Promise<Response> {
  return service({
    method: 'POST',
    url: '/medicine/add',
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data
  })
}

// 获取药品列表
export function getMedicineList(): Promise<DetailMedList> {
  return service({
    method: 'GET',
    url: '/medicine/detailList'
  })
}