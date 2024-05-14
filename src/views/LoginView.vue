<template>
  <div class="box">
    <el-form
      ref="formRef"
      style="max-width: 600px"
      :hide-required-asterisk="isLogin"
      :model="userInfo"
      label-width="auto"
      class="form"
    >
      <el-form-item
        label="账号"
        prop="account"
        minL
        :rules="[
          { required: true, message: '请输入账号' },
        ]"
      >
        <el-input
          v-model="userInfo.account"
          type="text"
          autocomplete="off"
          minLength="6"
          maxlength="10"
        />
      </el-form-item>
      <el-form-item
        label="用户名"
        prop="name"
        v-if="!isLogin"
        :rules="[
          { required: true, message: '请输入用户名' },
        ]"
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
        :rules="[
          { required: true, message: '请输入密码' }
        ]"
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
        :rules="[
          { required: true, message: '请确认密码' }
        ]"
      >
        <el-input
          v-model="userInfo.checkPwd"
          type="password"
          maxlength="16"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item v-if="isLogin">
        <el-button type="primary" @click="handleLogin(formRef)">登 录</el-button>
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
  import { register, login } from '@/api/user';
  import { md5 } from 'js-md5'
  import { useUserStore } from '@/stores/user'
  import type { loginData, response } from '@/utils/types';

  const emits = defineEmits(['loginSuccess'])
  const user = useUserStore()
  const formRef = ref<FormInstance>()
  const isLogin = ref(true)
  const userInfo = reactive({
    account: '',
    name: '',
    pwd: '',
    checkPwd: ''
  })

  const toRegister = () => {
    isLogin.value = false
  }
  
  const submitRegister = async () => {
    formRef.value?.validate()
      .then(() => console.log('校验通过'))
      .catch(() => console.log('校验失败'))
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
        console.log('error submit!')
        return false
      }
    })
  }

  const loginSuccess = (data: loginData, msg: string) => {
    localStorage.setItem('token', data.token)
    user.setUser(JSON.parse(decodeURIComponent(atob(data.token.split('.')[1]))))
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