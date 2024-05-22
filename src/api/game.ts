import service from "../utils//axios-instance";
import type { gameQuestion, gameResult, rankList } from "../utils/types";


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

// 查询游戏记录
export function getRecord(): Promise<{ score: number, playtimes: number }> {
  return service({
    method: 'GET',
    url: '/game/record'
  })
}

// 查询排行榜
export function getRankList(): Promise<rankList> {
  return service({
    method: 'GET',
    url: '/game/rank'
  })
}