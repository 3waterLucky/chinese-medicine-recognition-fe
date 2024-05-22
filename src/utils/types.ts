export interface UserInfo {
  account: string,
  name?: string,
  pwd: string,
  auth?: number
}

export interface Response {
  code: number,
  message: string
}

export interface GameQuestion extends Response{
  options: string[],
  answer: string,
  imgSrc: string
}

export interface GameResult extends Response{
  totalScore: number
}

export interface RecogResult extends Response{
  recog_id: number,
  m_id: number,
  name: string,
  score: number
}

export interface LoginData extends Response{
  token: string
}

export interface UserListItem {
  user_id: number,
  user_account: string,
  user_name: string,
  auth: number,
  score: number,
  playtimes: number
}
export interface UserList extends Response {
  users: UserListItem[]
}

export interface ErrorType extends Error {
  code: number
}

export interface RecogRecordsItem {
  id: number,
  recog_result: string,
  score: number,
  recog_date: string
}
export interface RecogRecords extends Response {
  records: RecogRecordsItem[]
}

export interface SevenDayData extends Response {
  daily: number[]
}

export interface MedicineInfo {
  m_name: string,
  pinyin?: string,
  other_name?: string,
  origin?: string,
  env?: string,
  form?: string,
  flavor?: string,
  functions?: string,
  usages?: string
}

export interface MedInfoItem extends MedicineInfo {
  m_id: number
}

export interface UpdateUserInfo {
  editName: boolean,
  newName: string,
  editPwd: boolean,
  oldPwd: string,
  newPwd: string
}

export interface UpdateUserInfoResult extends Response {
  token: string
}

export interface RankListItem {
  user_name: string,
  score: number
}

export interface RankList extends Response {
  rankList: RankListItem[]
}

export interface DetailMedList extends Response {
  list: MedInfoItem[]
}

export interface MedicineDetail extends Response {
  data: MedInfoItem
}