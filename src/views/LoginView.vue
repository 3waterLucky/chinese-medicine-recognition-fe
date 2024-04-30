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
        :rules="[
          { required: true, message: '请输入账号' },
        ]"
      >
        <el-input
          v-model="userInfo.account"
          type="text"
          autocomplete="off"
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
        prop="psw"
        :rules="[
          { required: true, message: '请输入密码' }
        ]"
      >
        <el-input
          v-model="userInfo.psw"
          type="password"
          maxlength="16"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="checkPsw"
        v-if="!isLogin"
        :rules="[
          { required: true, message: '请确认密码' }
        ]"
      >
        <el-input
          v-model="userInfo.checkPsw"
          type="password"
          maxlength="16"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item v-if="isLogin">
        <el-button type="primary" @click="submitForm(formRef)">登 录</el-button>
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
  import { register } from '@/api';
  import md5 from 'md5'
  const emits = defineEmits(['loginSuccess'])

  const formRef = ref<FormInstance>()
  const isLogin = ref(true)
  const userInfo = reactive({
    account: '',
    name: '',
    psw: '',
    checkPsw: ''
  })

  const toRegister = () => {
    isLogin.value = false
  }
  
  const submitRegister = () => {
    formRef.value?.validate()
      .then(() => console.log('校验通过'))
      .catch(() => console.log('校验失败'))
    const md5psw = md5(userInfo.psw)
    register({
      account: userInfo.account,
      name: userInfo.name,
      psw: md5psw
    })
  }

  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        console.log('submit!')
      } else {
        console.log('error submit!')
        return false
      }
    })
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