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
        ></vueCropper>
      </div>
      <div class="center">
        <div class="left">
          <div class="result" v-show="resultReceived">识别结果<span>{{ recogResult.name }}</span></div>
          <div class="result-score" v-show="resultReceived">得分：<span>{{ recogResult.score }}</span></div>
        </div>
        <div class="croppedImg" v-show="!showCropper">
          <img :src="croppedImgSrc">
        </div>
        <div class="right">
          <el-button v-show="resultReceived" type="primary" color="#f5a623">添加收藏</el-button>
          <el-button v-show="resultReceived" type="primary">查看详情</el-button>
        </div>
      </div>
      <div class="recognizing" v-show="loading">识别中...</div>
      <div class="evaluate" v-show="resultReceived">
        <div class="eval-title">此次识别结果准确吗？</div>
        <div class="option">
          <div class="option-item">
            <svg t="1715351486230" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1413" width="200" height="200"><path d="M1024 512c0 282.773-229.227 512-512 512S0 794.773 0 512 229.227 0 512 0s512 229.227 512 512zM268.992 269.653a82.197 82.197 0 1 0 0 164.416 82.197 82.197 0 0 0 0-164.416z m486.016 0a82.197 82.197 0 1 0 0 164.416 82.197 82.197 0 0 0 0-164.416z m-22.101 360.32C712 725.504 614.293 820.523 512.49 820.523s-205.526-95.019-226.432-190.55c0 0-6.72-28.309-32.918-28.309-22.101 0-21.93 28.31-21.93 28.31 21.888 135.637 139.477 239.231 281.28 239.231 141.824 0 259.413-103.594 281.28-239.232 0 0 6.314-28.309-19.968-28.309-31.147 0-40.896 28.31-40.896 28.31z" p-id="1414" fill="#1296db"></path></svg>
            <span>很准确</span>
          </div>
          <div class="option-item">
            <svg t="1715350682413" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="930"><path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512zM277.333 469.333a64 64 0 1 0 0-128 64 64 0 0 0 0 128z m469.334 0a64 64 0 1 0 0-128 64 64 0 0 0 0 128zM384 682.667A42.667 42.667 0 0 0 384 768h256a42.667 42.667 0 0 0 0-85.333H384z" p-id="931"></path></svg>
            <span>不清楚</span>
          </div>
          <div class="option-item">
            <svg t="1715350749711" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1252"><path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024zM332.8 460.8a76.8 76.8 0 1 0 0-153.6 76.8 76.8 0 0 0 0 153.6z m358.4 0a76.8 76.8 0 1 0 0-153.6 76.8 76.8 0 0 0 0 153.6z m39.936 297.574A391.475 391.475 0 0 0 511.181 691.2c-78.746 0-154.112 23.245-218.112 66.048a25.6 25.6 0 0 0 28.365 42.598A340.275 340.275 0 0 1 511.18 742.4c69.222 0 135.168 20.48 191.283 58.368a25.6 25.6 0 1 0 28.672-42.394z" p-id="1253"></path></svg>
            <span>不准确</span>
          </div>
        </div>
      </div>
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
import { ref, reactive, onBeforeMount } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadInstance, UploadFile } from 'element-plus'
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper"
import { getAccuracy, recognize } from '@/utils/api'

const recogResult = ref({ name: '', score: 0 })
const loading = ref(false)
const fileSelected = ref(false)
const resultReceived = ref(false)
const showCropper = ref(false)
const croppedImgSrc = ref('')
const dialogTitle = ref("请截取图中您要识别的中草药")
const upload = ref<UploadInstance>()
const cropper = ref()
const accuracy = ref(0)

const cropperOption = reactive({
  img: '',
  size: 1,
  outputType: 'jpeg',
  fixed: true,
  original: true
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
      svg {
        width: 1.5rem;
        height: 1.5rem;
        margin-bottom: 1vh;
      }
    }
  }
}
</style>