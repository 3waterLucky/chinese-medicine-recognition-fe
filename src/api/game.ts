import service from "../utils//axios-instance";
import type { gameQuestion, gameResult } from "../utils/types";


// 获取问题
export function getQuestion(): Promise<gameQuestion> {
  return service({
    method: 'GET',
    url: '/game/question'
  })
}

// 提交分数
export function submitScore(score: number): Promise<gameResult> {
  return service({
    method: 'POST',
    url: '/game/score',
    data: { score }
  })
}
