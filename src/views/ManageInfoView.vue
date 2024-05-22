<template>
  <div class="left"></div>
  <div class="container" v-bind="$attrs">
    <el-tabs v-model="activeName" class="tabs" tab-position="left">
      <el-tab-pane label="添加信息" name="add">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="auto"
          status-icon
        >
          <el-form-item label="名称" prop="m_name" :rules="rules.m_name">
            <el-input v-model="ruleForm.m_name" placeholder="请输入中草药名称" />
          </el-form-item>
          <el-form-item label="拼音" prop="pinyin" :rules="rules.pinyin">
            <el-input v-model="ruleForm.pinyin" placeholder="请输入中草药拼音" />
          </el-form-item>
          <el-form-item label="别名" prop="other_name" :rules="rules.other_name">
            <el-input v-model="ruleForm.other_name" placeholder="请输入中草药别名" />
          </el-form-item>
          <el-form-item label="来源" prop="origin" :rules="rules.origin">
            <el-input v-model="ruleForm.origin" autosize type="textarea" placeholder="请输入中草药来源" />
          </el-form-item>
          <el-form-item label="生境分布" prop="env" :rules="rules.env">
            <el-input v-model="ruleForm.env" autosize type="textarea" placeholder="请输入中草药生境分布" />
          </el-form-item>
          <el-form-item label="原形态" prop="form" :rules="rules.form">
            <el-input v-model="ruleForm.form" autosize type="textarea" placeholder="请输入中草药原形态" />
          </el-form-item>
          <el-form-item label="性味" prop="flavor" :rules="rules.flavor">
            <el-input v-model="ruleForm.flavor" placeholder="请输入中草药性味" />
          </el-form-item>
          <el-form-item label="功能主治" prop="functions" :rules="rules.functions">
            <el-input v-model="ruleForm.functions" autosize type="textarea" placeholder="请输入中草药功能主治" />
          </el-form-item>
          <el-form-item label="用法用量" prop="usages" :rules="rules.usages">
            <el-input v-model="ruleForm.usages" autosize type="textarea" placeholder="请输入中草药用法用量" />
          </el-form-item>
          <!-- 图片 -->
          <el-form-item label="图片" prop="image">
            <el-upload 
              ref="upload"
              class="imgUpload"
              v-model:file-list="fileList"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :auto-upload="false"
              :limit="1"
              :on-exceed="handleExceed"
              :show-file-list="false"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <img :src="fileList[0]?.url" v-if="fileList[0]?.url" style="margin-left: 2vw; width: 7vw;"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">添加</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="资料列表" name="list" status-icon lazy style="overflow: auto; width: 100%;">
        <el-table 
          :data="tableData" 
          stripe
          style="width: 100%" 
          max-height="70vh"
        >
          <el-table-column prop="m_id" label="序号" width="80" align="center" />
          <el-table-column :formatter="formatter" prop="m_name" label="名称" width="120" align="center" />
          <el-table-column :formatter="formatter" prop="pinyin" label="拼音" width="120" align="center" />
          <el-table-column :formatter="formatter" prop="other_name" label="别名" width="120" align="center" />
          <el-table-column :formatter="formatter" prop="origin" label="来源" width="200" align="center" />
          <el-table-column :formatter="formatter" prop="env" label="生境分布" width="200" align="center" />
          <el-table-column :formatter="formatter" prop="form" label="原形态" width="200" align="center" />
          <el-table-column :formatter="formatter" prop="flavor" label="性味" width="120" align="center" />
          <el-table-column :formatter="formatter" prop="functions" label="功能主治" width="200" align="center" />
          <el-table-column :formatter="formatter" prop="usages" label="用法用量" width="200" align="center" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="right"></div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import type { MedicineInfo, MedInfoItem } from '@/utils/types'
import { genFileId } from 'element-plus'
import type { FormInstance, FormRules, UploadInstance, UploadRawFile, UploadProps, UploadUserFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { addMedicine, getMedicineList } from '@/api/manageInfo'

// 表单页
// #region
const activeName = ref('add')
const ruleFormRef = ref<FormInstance>()
const upload = ref<UploadInstance>()
const fileList = ref<UploadUserFile[]>([])

const ruleForm = reactive<MedicineInfo>({
  m_name: '',
  pinyin: '',
  other_name: '',
  origin: '',
  env: '',
  form: '',
  flavor: '',
  functions: '',
  usages: ''
})

const rules = reactive<FormRules<MedicineInfo>>({
  m_name: [
    { required: true, message: '请输入中草药名称', trigger: 'blur' }
  ]
})

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const formData = new FormData()
      Object.entries(ruleForm).forEach(([key, value]) => {
        formData.append(key, value)
      })
      formData.append('image', fileList.value[0].raw as File)
      const res = await addMedicine(formData)
      if (res.code === 200) {
        ElMessage.success('添加信息成功')
        formEl.resetFields()
        upload.value!.clearFiles()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

// #endregion

// 列表页
// #region
const tableData = ref<MedInfoItem[]>([])

onBeforeMount(async () => {
  const res = await getMedicineList()
  tableData.value = res.list
})

interface ColumnType extends Object {
  property: string
}

// formatter，用于对表格中的每一列的数据进行格式化，去掉最开头的两个字符和最后的两个字符。每一列都调用这同一个函数进行格式化。
// T为泛型参数，继承自ColumnType，是colunm参数的类型
const formatter = <T extends ColumnType>(row: MedInfoItem, column: T) => {
  const prop = column.property
  if (prop) {
    // 去掉字符串中的“\r”和“\n”
    return row[prop].replace(/\r|\n/g, '')
  }
}

// #endregion
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
  height: 100%;
  width: 100%;

  .tabs {
    height: 100%;
    width: 100%;
    overflow: scroll;

    &::-webkit-scrollbar {
      display: none;
    }

    & :deep(.el-tabs__item) {
      font-size: 1.2rem;
      font-weight: 600;
      height: 10vh;
    }

    & :deep(.el-tabs__content) {
      padding: 20px;
    }

    & :deep(.el-upload--picture-card) {
      --el-upload-picture-card-size: 7vw;
    }
    
    & :deep(.el-form-item):last-child .el-form-item__content {
      display: flex;
      justify-content: center;
    }
  }
}
</style>