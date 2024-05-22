<template>
  <el-dialog
    class="dialog"
    v-model="visible"
    title="详细信息"
    align-center
    width="80vw"
  >
    <el-descriptions
      class="list"
      direction="vertical"
      :column="4"
      size="default"
      border
    >
      <el-descriptions-item label="图片" :span="2">
        <img :src="`http://127.0.0.1:8080/images/medicine/${ detail?.m_name }/example.jpg`" alt="">
      </el-descriptions-item>
      <el-descriptions-item label="名称">{{ detail?.m_name }}</el-descriptions-item>
      <el-descriptions-item label="原形态">
        {{ detail?.form }}
      </el-descriptions-item>
      <el-descriptions-item label="拼音">{{ detail?.pinyin }}</el-descriptions-item>
      <el-descriptions-item label="别名">{{ detail?.other_name }}</el-descriptions-item>
      <el-descriptions-item label="来源">
        {{ detail?.origin }}
      </el-descriptions-item>
      <el-descriptions-item label="生境分布">
        {{ detail?.env }}
      </el-descriptions-item>
      <el-descriptions-item label="性味归经">
        {{ detail?.flavor }}
      </el-descriptions-item>
      <el-descriptions-item label="功能主治">
        {{ detail?.functions }}
      </el-descriptions-item>
      <el-descriptions-item label="用法用量">
        {{ detail?.usages}}
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCollection" v-if="showCollectButton" color="#f5a623" style="color: #fff">添加收藏</el-button>
        <el-button @click="handleCancelCollection" v-else color="#dbc163" style="color: #bbb">已收藏</el-button>
        <el-button @click="visible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount } from 'vue'
import { getDetail, addCollection, getCollection, cancelCollection } from '@/api/medicine'
import type { MedInfoItem } from '@/utils/types'

const visible = defineModel('visible', { type: Boolean })
const props = defineProps<{
  m_id: number
}>()
const detail = ref<MedInfoItem>()
const showCollectButton = ref(true)

onBeforeMount(async() => {
  detail.value = (await getDetail(props.m_id)).data
  if (localStorage.getItem('token')) {
    const res = await getCollection()
    if (res.list.some(item => item.m_id === props.m_id)) {
      showCollectButton.value = false
    } else {
      showCollectButton.value = true
    }
  }
})

const handleCollection = async () => {
  // 判断是否已登录，若未登录，则提示登录
  if (!localStorage.getItem('token')) {
    ElMessage.error('请先登录')
    return
  }
  try {
    const res = await addCollection(detail.value!.m_id)
    if (res.code === 200) {
      ElMessage.success('添加收藏成功')
      showCollectButton.value = false
    }
  } catch (error) {
    console.error(error)
  }
}

const handleCancelCollection = async () => {
  try {
    const res = await cancelCollection(detail.value!.m_id)
    if (res.code === 200) {
      ElMessage.success('取消收藏成功')
      showCollectButton.value = true
    }
  } catch (error) {
    console.error(error)
  }
}

// 根据props.m_id的变化获取药材详细信息
watch(() => props.m_id, async(newVal) => {
  const res = await getDetail(newVal)
  if (res.code === 200) {
    detail.value = res.data
  } else if (res.code === 404) {
    ElMessage.error(res.message)
  }
  if (localStorage.getItem('token')) {
    const res = await getCollection()
    if (res.list.some(item => item.m_id === newVal)) {
      showCollectButton.value = false
    } else {
      showCollectButton.value = true
    }
  }
})
</script>

<style scoped>

</style>