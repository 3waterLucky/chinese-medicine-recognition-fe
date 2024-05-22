import service from "../utils//axios-instance"
import type { DetailMedList, Response, MedicineDetail } from "@/utils/types"

// 获取收藏夹信息
export function getCollection(): Promise<DetailMedList> {
  return service({
    method: 'GET',
    url: '/medicine/collection'
  })
}

// 添加收藏
export function addCollection(m_id: number): Promise<Response> {
  return service({
    method: 'POST',
    url: '/medicine/collect',
    data: { m_id }
  })
}

// 取消收藏
export function cancelCollection(m_id: number): Promise<Response> {
  return service({
    method: 'POST',
    url: '/medicine/cancelCollect',
    data: { m_id }
  })
}

// 获取详细信息
export function getDetail(m_id: number): Promise<MedicineDetail> {
  return service({
    method: 'GET',
    url: '/medicine/detail',
    params: { m_id }
  })
}

// 获取药品列表
export function getMedicineList(): Promise<DetailMedList> {
  return service({
    method: 'GET',
    url: '/medicine/list'
  })
}