<template>
  <div class="recog">
    <div class="header">
      <div class="welcome">
        欢迎使用图像识别功能！
      </div>
      <div class="accuracy">目前本系统用户评价的准确率为：{{ (accuracy * 100).toFixed(2) }}%</div>
    </div>
    <el-upload
      ref="upload"
      class="upload-demo"
      drag
      accept=".png, .jpg, .jpeg"
      :multiple="false"
      :auto-upload="false"
      :limit="1"
      :show-file-list="false"
      :on-change="uploadChange"
      v-show="!fileSelected"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖动图片到此处 或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          请选择jpg或png格式的图片
        </div>
      </template>
    </el-upload>
    <el-dialog
      v-model="fileSelected"
      :title="dialogTitle"
      width="50vw"
      align-center
      :show-close="false"
      @close="cropperDialogClose"
    >
      <div class="cropper-content" v-show="showCropper">
        <vueCropper
          ref="cropper"
          :autoCrop="true"
          :img="cropperOption.img"
          :outputSize="cropperOption.size"
          :outputType="cropperOption.outputType"
          :fixed="cropperOption.fixed"
          :original="cropperOption.original"
          :mode="cropperOption.mode"
        ></vueCropper>
      </div>
      <div class="center">
        <div class="left">
          <div class="result" v-show="resultReceived">识别结果<span>{{ recogResult!.name }}</span></div>
          <div class="result-score" v-show="resultReceived">得分：<span>{{ recogResult!.score }}</span></div>
        </div>
        <div class="croppedImg" v-show="!showCropper">
          <img :src="croppedImgSrc">
        </div>
        <div class="right">
          <el-button 
            @click="handleCollection"
            v-show="resultReceived && !collected" 
            type="primary" 
            color="#f5a623" 
            style="color: #fff"
          >
            添加收藏
          </el-button>
          <el-button 
            @click="handleCancelCollection"
            v-show="resultReceived && collected" 
            type="primary" 
            color="#dbc163" 
            style="color: #bbb"
          >
            已收藏
          </el-button>
          <el-button v-show="resultReceived" type="primary" @click="detailDialogVisible = true">查看详情</el-button>
          <MedInfoDialog v-model:visible="detailDialogVisible" :m_id="recogResult.m_id" />
        </div>
      </div>
      <div class="recognizing" v-show="loading">识别中...</div>
      <div class="evaluate" v-show="resultReceived">
        <div class="eval-title">此次识别结果准确吗？</div>
        <div class="option">
          <div class="option-item" @click="evaSelected = 1">
            <IconEvaColorA v-show="evaSelected === 1"/>
            <IconEvaGreyA v-show="evaSelected !== 1" />
            <span>很准确</span>
          </div>
          <div class="option-item" @click="evaSelected = 2">
            <IconEvaColorB v-show="evaSelected === 2"/>
            <IconEvaGreyB v-show="evaSelected !== 2"/>
            <span>不清楚</span>
          </div>
          <div class="option-item" @click="evaSelected = 0">
            <IconEvaColorC v-show="evaSelected === 0" />
            <IconEvaGreyC v-show="evaSelected !== 0"/>
            <span>不准确</span>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="fileSelected = false; resultReceived = false" :disabled="loading">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="handleConfirm">
            确 认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadInstance, UploadFile } from 'element-plus'
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper"
import { getAccuracy, recognize, submitEvaluate } from '@/api/recog'
import IconEvaColorA from '@/components/icons/IconEvaColorA.vue'
import IconEvaColorB from '@/components/icons/IconEvaColorB.vue'
import IconEvaColorC from '@/components/icons/IconEvaColorC.vue'
import IconEvaGreyA from '@/components/icons/IconEvaGreyA.vue'
import IconEvaGreyB from '@/components/icons/IconEvaGreyB.vue'
import IconEvaGreyC from '@/components/icons/IconEvaGreyC.vue'
import { addCollection, cancelCollection } from '@/api/medicine'
import type MedInfoDialog from '@/components/MedInfoDialog.vue'

const recogResult = ref<{
  name: string,
  score: number,
  m_id: number,
  recog_id: number
}>({
  name: '',
  score: 0,
  m_id: 0,
  recog_id: 0
})
const loading = ref(false)
const fileSelected = ref(false)
const resultReceived = ref(false)
const showCropper = ref(false)
const croppedImgSrc = ref('')
const dialogTitle = ref("请截取图中您要识别的中草药")   // el-dialog标题
const upload = ref<UploadInstance>()    // el-upload实例
const cropper = ref()     // vue-cropper实例
const accuracy = ref(0)   // 用户评价的准确率
const evaSelected = ref(-1) // 0: 不准确 1: 很准确 2: 不清楚
const collected = ref(false)    // 是否已收藏
const detailDialogVisible = ref(false)    // 详情弹窗是否显示

const cropperOption = reactive({
  img: '',
  size: 1,
  outputType: 'jpeg',
  fixed: true,
  original: true,
  mode: 'contain'
})

onBeforeMount(async () => {
  accuracy.value = (await getAccuracy()).accuracy
})

// el-upload选中图片时将图片的dataURL放入cropper
const uploadChange = (uploadFile: UploadFile) => {
  fileSelected.value = true
  showCropper.value = true
  const reader = new FileReader()
  reader.onload = e => {
    cropperOption.img = e.target?.result as string
  }
  reader.readAsDataURL(uploadFile.raw!)
}

// 关闭cropper弹窗时清空已选文件
const cropperDialogClose = () => {
  upload.value!.clearFiles()
}

// 点击确认提交按钮
const handleConfirm = () => {
  if (resultReceived.value) {
    fileSelected.value = false
    resultReceived.value = false
    if (evaSelected.value === 0 || evaSelected.value === 1) {
      // 提交用户评价
      submitEvaluate({
        id: recogResult.value!.recog_id,
        score: evaSelected.value
      }).finally(() => {
        evaSelected.value = -1
      })
    }
    dialogTitle.value = "请截取图中您要识别的中草药"
  } else {
    loading.value = true
    showCropper.value = false
    cropper.value.getCropData((data: string) => {
      const img = document.createElement('img')
      img.src = data
      croppedImgSrc.value = data
      img.onload = () => {    // 监听图片加载完成再执行canvas绘图
        const canvas = document.createElement('canvas')
        canvas.width = 224
        canvas.height = 224
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, img.width, img.height, 0, 0, 224, 224)
        const formData = new FormData()
        canvas.toBlob(async (blob) => {
          const file = new File([blob!], `${Date.now}.jpg`, {
            type: 'image/jpeg'
          })
          formData.append('image', file)
          try {
            const result = await recognize(formData)
            recogResult.value = result
            resultReceived.value = true
            loading.value = false
            dialogTitle.value = "识别成功"
          } catch (error) {
            loading.value = false
          }
        }, 'image/jpeg')
      }
    })
  }
}

const handleCollection = async () => {
  try {
    const res = await addCollection(recogResult.value.m_id)
    if (res.code === 200) {
      collected.value = true
    }
  } catch (error) {
    console.error(error)
  }
}

const handleCancelCollection = async () => {
  try {
    const res = await cancelCollection(recogResult.value.m_id)
    if (res.code === 200) {
      collected.value = false
    }
  } catch (error) {
    console.error(error)
  }
}

</script>

<style lang="less" scoped>

.header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .welcome {
    font-size: 2rem;
    margin: 2vh 0;
    color: rgb(78, 138, 201);
  }

  .accuracy {
    font-size: 1rem;
    color: #666;
    margin-bottom: 5vh;
  }
}

.cropper-content {
  width: inherit;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.croppedImg {
  width: inherit;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    display: block;
    height: inherit;
  }
}

.recognizing {
  width: inherit;
  text-align: center;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2vh 0;
  .left {
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-right: 2vw;
  }
  .right {
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 2vw;

    button {
      margin-left: 0;
      margin-top: 3vh;
    }
  }
}

.result {
  font-size: 1.8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    display: block;
    color: green;
  }
}

.result-score {
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2vh;
  span {
    color: green;
  }
}

.evaluate {
  width: 100%;
  border-top: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .eval-title {
    font-size: 1rem;
    margin: 1vh 0;
  }

  .option {
    display: flex;
    justify-content: center;
    align-items: center;
    .option-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 2vw;
      cursor: pointer;
      svg {
        width: 1.5rem;
        height: 1.5rem;
        margin-bottom: 1vh;
      }
    }
  }
}
</style>