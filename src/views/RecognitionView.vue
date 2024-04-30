<template>
  <div class="recog">
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
        ></vueCropper>
      </div>
      <div class="croppedImg" v-show="!showCropper">
        <img :src="croppedImgSrc">
      </div>
      <div class="recognizing" v-show="loading">识别中...</div>
      <div class="result" v-show="resultReceived">识别结果：<span>{{ recogResult.name }}</span></div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="fileSelected = false; resultReceived = false" :disabled="loading">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="submitImg">
            确 认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadInstance, UploadProps, UploadFile, UploadFiles, UploadRawFile } from 'element-plus'
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper"
import { recognize } from '@/api'

const recogResult = ref({ name: '', score: 0 })
const loading = ref(false)
const fileSelected = ref(false)
const resultReceived = ref(false)
const showCropper = ref(false)
const croppedImgSrc = ref('')
const dialogTitle = ref("请截取图中您要识别的中草药")
const upload = ref<UploadInstance>()
const cropper = ref()

const cropperOption = reactive({
  img: '',
  size: 1,
  outputType: 'jpeg',
  fixed: true,
  original: true
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
const submitImg = () => {
  if (resultReceived.value) {
    fileSelected.value = false
    resultReceived.value = false
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
          const result = await recognize(formData)
          recogResult.value = result.data
          resultReceived.value = true
          loading.value = false
          dialogTitle.value = "识别成功"
        }, 'image/jpeg')
      }
    })
  }
}

</script>

<style scoped>

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
}

.croppedImg img {
  display: block;
  height: inherit;
}

.recognizing {
  width: inherit;
  text-align: center;
}

.result {
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.result span {
  color: green;
}
</style>