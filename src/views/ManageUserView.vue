<template>
  <div class="left"></div>
  <div class="container" v-bind="$attrs">
    <el-tabs v-model="activeName" class="tabs" tab-position="left">
      <el-tab-pane label="用户列表" name="list">
        <el-table :data="tableData" stripe style="width: 100%" max-height="70vh" highlight-current-row>
          <el-table-column prop="user_account" label="账号" width="150" align="center" />
          <el-table-column prop="user_name" label="用户名" width="150" align="center" />
          <el-table-column prop="auth" label="权限" :formatter="authFormatter" width="150" align="center" />
          <el-table-column prop="score" label="游戏积分" width="150" align="center" />
          <el-table-column prop="playtimes" label="游戏次数" width="150" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-popconfirm 
                title="确定重置该用户密码吗？"
                confirm-button-text="确定"
                confirm-button-type="danger"
                cancel-button-text="取消"
                width="180px"
                @confirm="handleResetPwd(scope.row)"
              >
                <template #reference>
                  <el-button 
                    link 
                    type="primary" 
                    size="small"
                    :disabled="userStore.auth <= scope.row.auth"
                  >
                    重置密码
                  </el-button>
                </template>
              </el-popconfirm>
              <el-popconfirm 
                title="确定删除该用户吗？"
                confirm-button-text="确定"
                confirm-button-type="danger"
                cancel-button-text="取消"
                width="180px"
                @confirm="handleDelete(scope.$index, scope.row)"
              >
                <template #reference>
                  <el-button 
                    link 
                    type="primary" 
                    size="small"
                    :disabled="userStore.auth <= scope.row.auth"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="添加用户" name="add" status-icon>
        <el-form 
          ref="ruleFormRef"
          :rules="rules" 
          :model="ruleForm"
        >
          <el-form-item label="账号" prop="user_account" :rules="rules.user_account">
            <el-input v-model="ruleForm.user_account" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="用户名" prop="name" :rules="rules.name">
            <el-input v-model="ruleForm.name" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="pwd" :rules="rules.pwd">
            <el-input v-model="ruleForm.pwd" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="权限" prop="auth" :rules="rules.auth">
            <el-radio-group v-model="ruleForm.auth">
              <el-radio value="0">普通用户</el-radio>
              <el-radio value="1" :disabled="userStore.auth !== 2">管理员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">添加</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="right"></div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, reactive } from 'vue'
import type { FormRules, FormInstance } from 'element-plus'
import { getUserList, deleteUser, checkAccount, addUser, resetPwd } from '@/api/manageUser'
import type { UserListItem, ErrorType } from '@/utils/types'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const activeName = ref('list')
const tableData = ref<UserListItem[]>()

onBeforeMount(async() => {
  tableData.value = (await getUserList()).users
})

// 用户列表部分：
const authFormatter = (row: UserListItem) => {
  const authArr = ['普通用户', '管理员', '超级管理员']
  return authArr[row.auth]
}

const handleResetPwd = async (row: any) => {
  const res = await resetPwd(row.user_id)
  if (res.code === 200) {
    // 使用element-plus的Message Box进行提示，标题为“成功”，内容为“重置密码成功”
    ElMessageBox({
      title: '提示',
      message: `为用户“${row.user_name}”重置密码成功！`,
      type: 'success'
    })
  } else {
    ElMessageBox({
      title: '提示',
      message: `为用户“${row.user_name}”重置密码失败！`,
      type: 'error'
    })
  }
}

const handleDelete = (index: number, row: UserListItem) => {
  deleteUser(row.user_id).then(() => {
    tableData.value!.splice(index, 1)
    ElMessageBox({
      title: '提示',
      message: `删除用户“${row.user_name}”成功！`,
      type: 'success'
    })
  }).catch((err) => {
    ElMessageBox({
      title: '提示',
      message: `删除用户“${row.user_name}”失败！`,
      type: 'error'
    })
  })
}

// 添加用户部分：
const ruleFormRef = ref<FormInstance>()

interface RuleForm {
  user_account: string,
  name: string,
  pwd: string,
  auth: '0' | '1',
}

const ruleForm = reactive<RuleForm>({
  user_account: '',
  name: '',
  pwd: '',
  auth: '0'
})

const rules = reactive<FormRules<RuleForm>>({
  user_account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    // 账号的长度限制在6-10位
    { min: 6, max: 10, message: '账号长度在6-10位', trigger: ['change', 'blur'] },
    // 账号只能包含数字和字母
    { pattern: /^[0-9a-zA-Z]+$/, message: '账号只能包含数字和字母', trigger: ['change', 'blur'] },
    // 账号不能重复
    { asyncValidator: async (rule, value, callback) => {
      const res = await checkAccount(value)
      if (res.code === 200) {
        callback()
      } else {
        callback(new Error('账号已存在'))
      }
    }, trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    // 用户名的长度限制在2-10位
    { min: 2, max: 10, message: '用户名长度在2-10位', trigger: 'change' }
  ],
  pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    // 密码的长度限制在6-16位
    { min: 6, max: 16, message: '密码长度在6-16位', trigger: ['change', 'blur'] },
    // 密码只能包含数字、字母或特殊字符
    { pattern: /^[0-9a-zA-Z!@#$%^&*]+$/, message: '密码只能包含数字、字母或特殊字符', trigger: ['change', 'blur'] }
  ],
  // 如果userStore.state.user.auth为1，则只能添加普通用户。validator应为同步代码。
  auth: [
    { required: true, message: '请选择权限', trigger: 'change' },
    { validator: (rule, value, callback) => {
      if (userStore.auth !== 2 && value === 1) {
        callback(new Error('您没有权限添加管理员'))
      } else {
        callback()
      }
    }, trigger: 'change' }
  ]
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        await addUser({
          account: ruleForm.user_account,
          name: ruleForm.name,
          pwd: ruleForm.pwd,
          auth: Number(ruleForm.auth)
        })
        ElMessage.success('添加成功')
        ruleFormRef.value?.resetFields()
        tableData.value = (await getUserList()).users
      } catch (error) {
        if ((error as ErrorType).code !== 500) {
          ElMessage.error((error as ErrorType).message || '添加失败')
        }
      }
    }
  })
}
</script>

<style scoped lang="less">
.left,
.right {
  width: 10vw;
  height: 100%;
  background-color: #f0f0f0;
}

.left {
  float: left;
}

.right {
  float: right;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
}

.tabs {
  height: 100%;
  width: 100%;

  & :deep(.el-tabs__item) {
    font-size: 1.2rem;
    font-weight: 600;
    height: 10vh;
  }

  & :deep(.el-tabs__content) {
    padding: 32px;
  }

  .el-input {
    width: 40%;
  }
}
</style>