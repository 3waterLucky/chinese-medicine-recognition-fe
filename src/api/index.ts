import axios from 'axios'

export function recognize(image: FormData) {
  return axios({
    method: 'POST',
    url: '/api/recog',
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: image
  })
}

export function getQuestion() {
  return axios({
    method: 'GET',
    url: '/api/game/question'
  })
}

type userInfo = {
  account: string,
  name?: string,
  pwd: string,
}
export function register(userInfo: userInfo) {
  return axios({
    method: 'POST',
    url: '/api/users/register',
    data: userInfo
  })
}