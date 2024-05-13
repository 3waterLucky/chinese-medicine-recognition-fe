export type userInfo = {
  account: string,
  name?: string,
  pwd: string,
}

export interface response {
  code: number,
  message: string
}

export interface gameQuestion extends response{
  options: string[],
  answer: string,
  imgSrc: string
}

export interface recogResult extends response{
  recog_id: number,
  m_id: number,
  name: string,
  score: number
}

export interface loginData extends response{
  token: string
}

