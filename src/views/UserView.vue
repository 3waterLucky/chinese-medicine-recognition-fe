<template>
  <div class="container">
    <div class="welcome">欢迎您</div>
    <div class="name">
      <span v-if="userStore.auth">管理员：</span>
      {{ userStore.userName }}
    </div>
    <div class="options">
      <div class="item" @click="infoDialogVisible = true">
        <svg t="1715358632037" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4271" width="3vw" height="3vw"><path d="M922.337486 396.650229c-20.457491 0-34.092498 13.635007-34.092498 34.092498v436.40987c0 47.727505-34.102458 88.642487-81.839923 88.642487H172.25273c-47.737465 0-102.287454-40.914982-102.287454-88.642487V232.990303c0-47.727505 54.549989-95.46497 102.287454-95.464971h361.402391c20.457491 0 34.092498-13.635007 34.092498-34.092498s-13.635007-34.092498-34.092498-34.092498H172.25273C76.78776 69.340336 1.78028 137.525332 1.78028 232.990303v634.172254c0 95.46497 75.00748 156.837443 170.47245 156.837443h634.162295c95.46497 0 150.014959-61.372472 150.014959-156.837443V437.555251c0-20.457491-13.635007-40.905022-34.092498-40.905022m62.378415-313.615126L933.960607 32.269849c-38.06647-38.06647-101.520547-38.06647-139.587017 0l-88.821764 107.864959-482.205168 469.516345v12.688823l-63.444117 209.375546 44.410882 38.066471 196.686722-69.788529h12.688824l463.171933-488.539621 107.864959-88.831723c38.05651-38.06647 38.05651-101.510587-0.00996-139.587017M248.724305 780.960229l31.722058-88.821764 57.099705 57.109665-88.821763 31.712099m145.931429-63.444117l-88.821764-88.831724 437.784327-431.449875 82.487312 82.487312-431.449875 437.794287m545.649285-545.659246l-63.444117 63.444117-95.166175-95.166175 63.444117-63.444117c6.344412 0 19.033235-6.344412 25.377646-6.344412 6.344412 0 19.033235 6.344412 25.377647 6.344412l50.765254 50.755293c6.334452 12.688823 6.334452 31.732018-6.354372 44.410882" fill="#ffffff" p-id="4272"></path></svg>
        修改信息
      </div>
      <div class="item" v-if="!userStore.auth" @click="handleCollection">
        <svg t="1715358703083" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7817" width="3vw" height="3vw"><path d="M454.613333 96.682667l-110.122666 223.146666-246.272 35.797334a64 64 0 0 0-35.456 109.141333l178.176 173.696-42.069334 245.290667a64 64 0 0 0 6.442667 40.576l3.114667 5.333333a64 64 0 0 0 83.328 21.546667L512 835.413333l220.245333 115.797334a64 64 0 0 0 92.885334-67.456l-42.069334-245.290667 178.176-173.653333a64 64 0 0 0-35.456-109.226667l-246.272-35.754667-110.08-223.146666a64 64 0 0 0-114.816 0zM512 173.226667l91.008 184.362666 3.328 6.144a85.333333 85.333333 0 0 0 60.928 40.533334l203.434667 29.525333-147.2 143.573333-4.821334 5.077334a85.333333 85.333333 0 0 0-19.712 70.442666l34.730667 202.624-201.813333-106.069333-4.778667-2.133333a42.666667 42.666667 0 0 0-34.986667 2.133333L290.304 855.466667l34.773333-202.624 0.896-6.912a85.333333 85.333333 0 0 0-25.429333-68.608l-147.242667-143.573334 203.52-29.525333a85.333333 85.333333 0 0 0 64.213334-46.677333L512 173.226667z" fill="#ffffff" p-id="7818"></path></svg>
        收藏夹
      </div>
      <el-popover
        v-if="!userStore.auth"
        placement="bottom"
        title="游戏记录"
        :width="200"
        trigger="hover"
      >
        <template #reference>
          <div class="item" >
            <svg t="1715358740766" class="icon" viewBox="0 0 1118 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9028" width="3vw" height="3vw"><path d="M821.248 186.368q40.96-34.816 92.672-43.008t96.768 5.632 75.776 48.64 30.72 86.016l0 385.024q0 43.008-12.8 79.36t-36.864 60.416-58.368 32.768-77.312-3.584q-28.672-8.192-52.224-22.016t-45.056-28.16-43.008-26.624-46.08-16.384l-372.736 0q-24.576 0-46.592 11.776t-43.52 27.136-45.056 30.72-51.2 23.552q-43.008 12.288-77.312 3.584t-58.88-33.28-37.376-61.44-12.8-79.872l0-382.976q6.144-50.176 37.888-84.992t73.728-49.152 88.576-6.144 82.432 43.008q15.36 15.36 44.032 38.912t65.024 46.08 79.36 38.4 88.064 15.872q44.032 0 84.48-16.384t74.24-38.912 59.904-46.08 43.52-37.888zM232.448 651.264q19.456 0 36.352-7.168t29.696-19.456 19.968-29.184 7.168-36.352q0-38.912-27.136-66.048t-66.048-27.136q-19.456 0-36.352 7.168t-29.696 19.968-19.968 29.696-7.168 36.352q0 38.912 27.136 65.536t66.048 26.624zM977.92 512l-46.08 0 0-46.08-93.184 0 0 46.08-47.104 0 0 93.184 47.104 0 0 46.08 93.184 0 0-46.08 46.08 0 0-93.184z" p-id="9029" fill="#ffffff"></path></svg>
            游戏记录
          </div>
        </template>
        <div>游戏积分：{{ score }}</div>
        <div>游戏次数：{{ playtimes }}</div>
      </el-popover>
      <div class="item" @click="handleLogout">
        <svg t="1715358787757" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10083" width="3vw" height="3vw"><path d="M814 65.9H265.7c-80.5 0-146 65.5-146 146V320c0 19.9 16.1 36 36 36s36-16.1 36-36V211.9c0-40.8 33.2-74 74-74H814c40.8 0 74 33.2 74 74v602.6c0 40.8-33.2 74-74 74H265.7c-40.8 0-74-33.2-74-74V704.2c0-19.9-16.1-36-36-36s-36 16.1-36 36v110.3c0 80.5 65.5 146 146 146H814c80.5 0 146-65.5 146-146V211.9c0-80.5-65.5-146-146-146z" p-id="10084" fill="#ffffff"></path><path d="M549.7 680.5c-13.5 14.6-12.6 37.4 2 50.9 6.9 6.4 15.7 9.6 24.4 9.6 9.7 0 19.4-3.9 26.5-11.6l177.4-192c6.5-7 9.6-15.9 9.5-24.8 0.1-8.8-3.1-17.7-9.5-24.8l-177.4-192c-13.5-14.6-36.3-15.5-50.9-2-14.6 13.5-15.5 36.3-2 50.9l121.6 131.6H100c-19.9 0-36 16.1-36 36s16.1 36 36 36h571.8L549.7 680.5z" p-id="10085" fill="#ffffff"></path></svg>
        退出登录
      </div>
    </div>
    <el-dialog
      v-model="infoDialogVisible"
      title="修改信息"
      width="600"
      align-center
      :show-close="false"
    >
      <el-form 
        ref="infoFormRef"
        :model="infoForm"
        :rules="infoRules"
      >
        <el-form-item label="修改用户名" label-width="auto" prop="newName">
          <el-switch v-model="infoForm.editName" />
          <el-input v-model="infoForm.newName" v-show="infoForm.editName" />
        </el-form-item>
        <el-form-item label="修改密码" label-width="auto">
          <el-switch v-model="infoForm.editPwd" />
        </el-form-item>
        <el-form-item label="原密码" label-width="auto" v-show="infoForm.editPwd" prop="oldPwd">
          <el-input
            v-model="infoForm.oldPwd"
            class="pwd-input"
            type="password"
          />
        </el-form-item>
        <el-form-item label="新密码" label-width="auto" v-show="infoForm.editPwd" prop="newPwd">
          <el-input
            v-model="infoForm.newPwd"
            class="pwd-input"
            type="password"
          /> 
        </el-form-item>
        <el-form-item label="确认新密码" label-width="auto" v-show="infoForm.editPwd" prop="newPwd2">
          <el-input
            v-model="infoForm.newPwd2"
            class="pwd-input"
            type="password"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="infoDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditInfo">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="collectionDialogVisible"
      title="收藏夹"
      width="600"
      align-center
    >
      <el-table
        :data="collectionData"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="m_name" label="名称" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="text" @click="handleMedicineDetail(row.m_id)">查看</el-button>
            <el-button type="text" @click="handleCancelCollection(row.m_id)">取消收藏</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <MedInfoDialog v-model:visible="showDetailDialog" :m_id="detailedId" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { logout, updateUserInfo } from '@/api/user'
import { getCollection, cancelCollection } from '@/api/medicine'
import { setToken, removeToken } from '@/utils/auth'
import { ref, onBeforeMount, computed, reactive } from 'vue'
import { getRecord } from '@/api/game'
import type { FormInstance, FormRules } from 'element-plus'
import { md5 } from 'js-md5'
import type { ErrorType, MedInfoItem } from '@/utils/types'
import MedInfoDialog from '@/components/MedInfoDialog.vue'

const router = useRouter()
const userStore = useUserStore()
const emits = defineEmits(['logoutSuccess'])

const score = ref(0)
const playtimes = ref(0)
const infoDialogVisible = ref(false)

onBeforeMount(async () => {
  const res = await getRecord()
  score.value = res.score
  playtimes.value = res.playtimes
})

const infoFormRef = ref<FormInstance>()

interface InfoForm {
  editName: boolean,
  newName: string,
  editPwd: boolean,
  oldPwd: string,
  newPwd: string,
  newPwd2: string
}

const infoForm = reactive<InfoForm>({
  editName: true,
  newName: userStore.userName,
  editPwd: true,
  oldPwd: '',
  newPwd: '',
  newPwd2: ''
})

// 生成校验规则，当infoForm的editName为true时，用户名不能为空；当infoForm的editPwd为true时，原密码、新密码和确认新密码不能为空
const infoRules = computed(() => { return {
  newName: [
    { required: infoForm.editName, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '用户名长度在2-10位', trigger: ['change', 'blur'] }
  ],
  oldPwd: [
    { required: infoForm.editPwd, message: '请输入原密码', trigger: 'blur' }
  ],
  newPwd: [
    { required: infoForm.editPwd, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度在6-16位', trigger: 'blur' },
    { pattern: /^[0-9a-zA-Z!@#$%^&*]+$/, message: '密码只能包含数字、字母或特殊字符', trigger: ['change', 'blur'] }
  ],
  newPwd2: [
    { required: infoForm.editPwd, message: '请再次输入新密码', trigger: 'blur' },
    { validator: (_, value: string, callback: Function) => {
      if (value !== infoForm.newPwd) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ]
}})

const handleEditInfo = async () => {
  await infoFormRef.value?.validate(async (valid) => {
    if (valid) {
      // 提交修改信息
      try {
        const userData = {
          editName: infoForm.editName,
          newName: infoForm.newName,
          editPwd: infoForm.editPwd,
          oldPwd: md5(infoForm.oldPwd),
          newPwd: md5(infoForm.newPwd)
        }
        const data = await updateUserInfo(userData)
        if (data.code === 200) {
          infoDialogVisible.value = false
          ElMessage.success('修改信息成功')
          // 更新用户信息
          userStore.setUser(JSON.parse(decodeURIComponent(atob(data.token.split('.')[1]))))
          setToken(data.token)
        }
      } catch (error) {
        if (error instanceof Error && (error as ErrorType).code === 401) {
          ElMessage.error(error.message || '修改信息失败')
        }
      }
    } else {
      ElMessage.error('表单校验失败')
    }
  })
}

const collectionDialogVisible = ref(false)
const collectionData = ref<MedInfoItem[]>()
const showDetailDialog = ref(false)
const detailedId = ref(0)

const handleCollection = async () => {
  collectionDialogVisible.value = true
  const res = await getCollection()
  collectionData.value = res.list
}

const handleCancelCollection = async (id: number) => {
  try {
    await cancelCollection(id)
    ElMessage.success('取消收藏成功')
    collectionData.value = collectionData.value?.filter(item => item.m_id !== id)
  } catch (error) {
    console.log(error)
  }
}

const handleMedicineDetail = (id: number) => {
  showDetailDialog.value = true
  detailedId.value = id
}

const handleLogout = async () => {
  try {
    await logout()
    userStore.clearUser()
    router.push('/')
    removeToken()
    emits('logoutSuccess')
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('退出登录失败')
    }
  }
}

</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .welcome {
    font-size: 3rem;
    margin: 2vh 0;
    color: rgb(78, 138, 201);
  }

  .name {
    font-size: 2rem;
    margin: 2vh 0;
  }

  .options {
    margin-top: 5vh;
    display: flex;
    align-items: center;
    .item {
      width: 8vw;
      height: 8vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid #ccc;
      border-radius: 8vw;
      margin: 1vw;
      background-color: #2c1b81;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      box-shadow:
        0 0 0 3px #f4aab9,
        0 0 0 6px #66ccff;
      &:hover {
        background-color: #8c7ed0;
      }
    }
  }
}
</style>