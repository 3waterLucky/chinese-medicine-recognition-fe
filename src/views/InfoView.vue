<template>
  <div class="container">
    <ul>
      <li 
        v-for="(item, index) in showList" 
        :key="index"
        @click="toDetail(item.m_id)"
      >
        {{ item.m_name }}
      </li>
    </ul>
    <el-pagination class="pagination" :page-size="10" v-model:current-page="currentPage" background layout="prev, pager, next" :total="medicineList?.length" />
    <MedInfoDialog v-if="detailedId" v-model:visible="centerDialogVisible" :m_id="detailedId" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { getMedicineList } from '@/api/medicine'
import type { MedInfoItem } from '@/utils/types'

const medicineList = ref<MedInfoItem[]>()
const currentPage = ref(1)

onBeforeMount(() => {
  getMedicineList().then(res => {
    medicineList.value = res.list
  })
})

const centerDialogVisible = ref(false)

const detailedId = ref(0)

const showList = computed(() => {
  return medicineList.value?.slice((currentPage.value - 1) * 10, currentPage.value * 10)
})

const toDetail = (m_id: number) => {
  detailedId.value = m_id
  centerDialogVisible.value = true
}
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

ul {
  width: 50%;
  
  li {
    height: 5vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #c2c4ec;
    border-radius: 0.8vh;
    margin: 1vh;
    cursor: pointer;
  }
}

.pagination {
  margin-top: 2vh;
}
</style>