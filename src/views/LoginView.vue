<template>
  <div class="box">
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      style="max-width: 600px"
      :hide-required-asterisk="isLogin"
      :model="userInfo"
      label-width="auto"
      class="form"
    >
      <el-form-item label="账号" prop="account" >
        <el-input
          v-model="userInfo.account"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="用户名"
        prop="name"
        v-if="!isLogin"
      >
        <el-input
          v-model="userInfo.name"
          type="text"
          autocomplete="off"
          maxlength="10"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="pwd"
      >
        <el-input
          v-model="userInfo.pwd"
          type="password"
          maxlength="16"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="checkPwd"
        v-if="!isLogin"
      >
        <el-input
          v-model="userInfo.checkPwd"
          type="password"
          maxlength="16"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item v-if="isLogin">
        <el-button type="primary" @click="handleLogin(ruleFormRef)">登 录</el-button>
        <el-button @click="toRegister">注 册</el-button>
      </el-form-item>
      <el-form-item v-if="!isLogin">
        <el-button type="primary" @click="submitRegister()">注册并登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { register, login } from '@/api/user'
  import { md5 } from 'js-md5'
  import type { LoginData, Response } from '@/utils/types'
  import { setToken } from '@/utils/auth'
  import { useUserStore } from '@/stores/user'
  import { checkAccount } from '@/api/manageUser'

  const emits = defineEmits(['loginSuccess'])
  const ruleFormRef = ref<FormInstance>()
  const isLogin = ref(true)
  const userStore = useUserStore()
  const userInfo = reactive({
    account: '',
    name: '',
    pwd: '',
    checkPwd: ''
  })

  const rules = {
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      { min: 6, max: 10, message: '账号长度在6-10位', trigger: 'blur' },
      { pattern: /^[0-9a-zA-Z]+$/, message: '账号只能包含数字和字母', trigger: ['change', 'blur'] },
      { asyncValidator: async (rule: any, value: string, callback: Function) => {
        if (isLogin.value) {
          callback()
          return
        }
        const res = await checkAccount(value)
        if (res.code === 200) {
          callback()
        } else {
          callback(new Error('账号已存在'))
        }
      }, trigger: 'blur' }
    ],
    name: [
      { required: true , message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 10, message: '用户名长度在2-10位', trigger: 'change' }
    ],
    pwd: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 16, message: '密码长度在6-16位之间', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '密码只能包含字母、数字和下划线', trigger: ['change', 'blur'] }
    ],
    checkPwd: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      { validator: (rule: any, value: string, callback: Function) => {
        if (value !== userInfo.pwd) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }, trigger: 'blur' }
    ]
  }

  const toRegister = () => {
    isLogin.value = false
  }
  
  const submitRegister = async () => {
    if (!ruleFormRef.value) return
    await ruleFormRef.value.validate(async (valid) => {
      if (valid) {
        const md5pwd = md5(userInfo.pwd)
        try {
          const data = await register({
            account: userInfo.account,
            name: userInfo.name,
            pwd: md5pwd
          })
          if (data.code === 201) {
            loginSuccess(data, '注册成功')
          }
        } catch (error) {
          console.log('catch error')
          if (error instanceof Error) {
            ElMessage.error(error.message || '注册失败')
          } else {
            ElMessage.error('注册失败')
          }
        }
      } else {
        ElMessage.error('请检查输入')
      }
    })
   
  }

  const handleLogin = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        const md5pwd = md5(userInfo.pwd)
        try {
          const data = await login({
            account: userInfo.account,
            pwd: md5pwd
          })
          if (data.code === 200) {
            loginSuccess(data, '登录成功')
          }
        } catch (error) {
          if (error instanceof Error) {
            ElMessage.error(error.message || '登录失败')
          } else {
            ElMessage.error('登录失败')
          }
        }
        return false
      }
    })
  }

  const loginSuccess = (data: LoginData, msg: string) => {
    setToken(data.token)
    userStore.setUser(JSON.parse(decodeURIComponent(atob(data.token.split('.')[1]))))
    ElMessage.success(msg)
    emits('loginSuccess')
  }

</script>

<style scoped>
  .box {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>