<template>
  <div class="box1">
    <div class="box2">
      <template v-if="gaming">
        <div class="score">当前得分：{{ score }}</div>
        <div class="img">
          <img class="img" :src="imgSrc">
        </div>
        <ul>
          请选出图中中草药的名称：
          <li v-for="(item, index) in options"
            :class="[
              { waiting: isWaiting },
              { correct: item === answer },
              { wrong: selectedIndex === index && item !== answer }
            ]"
            :key="index"
            :data-index="index"
            @click="choose(index)">
            {{ item }}
          </li>
        </ul>
      </template>
      <template v-if="!gaming">
        <div class="end">游戏结束</div>
        <div class="finalScore">本局得分：<span>{{ score }}</span></div>
        <div class="total">您的总积分为：<span>{{ totalScore }}</span></div>
        <el-button class="again" @click="restart">再来一局</el-button>
        <el-button class="again" @click="showRank">查看排行榜</el-button>
        <el-dialog
          title="排行榜"
          v-model="rankDialogVisible"
          width="20%"
          @close="() => rankDialogVisible = false"
        >
          <el-table
            :data="rankList"
            stripe
            border
            height="55vh"
          >
            <el-table-column
              prop="user_name"
              label="用户名"
              min-width="100%"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="score"
              label="得分"
              min-width="100%"
              align="center"
            ></el-table-column>
          </el-table>
        </el-dialog>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
  import { getQuestion, submitScore, getRankList } from '@/api/game'

  const answer = ref('')    // 正确答案
  const options = ref<string[]>([])   // 选项
  const imgSrc = ref('')    // 图片地址
  const score = ref(0)    // 得分
  const gaming = ref(true)    // 是否正在游戏
  const totalScore = ref(0)   // 总积分

  const refreshQuestion = async () => {
    isWaiting.value = true
    const data = await getQuestion()
    options.value = data.options
    answer.value = data.answer
    imgSrc.value = data.imgSrc
    selectLock.value = false
    selectedIndex.value = -1
  }

  const isWaiting = ref(true)  // 是否等待用户选择
  const selectLock = ref(false)  // 选择锁，防止用户多次选择
  const selectedIndex = ref(-1)

  const choose = async (index: number) => {
    // 加锁，选择一个选项之后，不允许再选择
    if (selectLock.value) {
      return
    }
    selectLock.value = true
    isWaiting.value = false
    selectedIndex.value = index
    if (options.value[index] === answer.value) {
      score.value++
      setTimeout(() => {
        refreshQuestion()
      }, 2000);
    } else {
      const [gameResult] = await Promise.all([
        submitScore(score.value),
        new Promise<void>(resolve => setTimeout(() => {
          gaming.value = false
          selectLock.value = false
          resolve()
        }, 2000))
      ])
      totalScore.value = gameResult.totalScore
    }
  }

  const restart = () => {
    gaming.value = true
    score.value = 0
    refreshQuestion()
  }

  const rankDialogVisible = ref(false)  // 排行榜对话框是否显示
  const rankList = ref([])   // 排行榜数据

  const showRank = async () => {
    rankDialogVisible.value = true
    const data = await getRankList()
    rankList.value = data.rankList
  }

  onBeforeMount(() => {
    refreshQuestion()
  })

  onBeforeUnmount(() => {
    if (gaming.value && score.value) {
      submitScore(score.value)
    }
  })
</script>

<style lang="less" scoped>
  .box1 {
    width: 26vw;
    height: 72vh;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 5vw;
      height: 5vw;
      border-top: 1vh solid #1f2c5b;
      border-left: 1vh solid #1f2c5b;
    }
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 5vw;
      height: 5vw;
      border-top: 1vh solid #1f2c5b;
      border-right: 1vh solid #1f2c5b;
    }
  }

  .box2 {
    width: inherit;
    height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 5vw;
      height: 5vw;
      border-bottom: 1vh solid #1f2c5b;
      border-left: 1vh solid #1f2c5b;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 5vw;
      height: 5vw;
      border-bottom: 1vh solid #1f2c5b;
      border-right: 1vh solid #1f2c5b;
    }
  }

  .score {
    margin-top: -3vh;
    margin-bottom: 4vh;
    font-size: 3vh;
    color: #ea3a3a;
  }

  .img {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18vw;
    height: 18vw;
    box-shadow: 0 0 0 0.5vw #f4aab9, 0 0 0 1vw #66ccff;
    img {
      width: 18vw;
    }
  }

  ul {
    margin-top: 4vh;
    li {
      list-style-type: none;
      width: 10vw;
      height: 5vh;
      margin: 1vh;
      padding-left: 0.8vw;
      border-radius: 2.5vh;
      border: 0.5vh dotted #66ccff;
      line-height: 4vh;
      cursor: pointer;
      &.waiting:hover {
        background-color: #add8ed;
      }
      &:not(&.waiting) {
        &.correct {
          border-color: green;
          background-color: #8bce82;
        }
        &.wrong {
          border-color: red;
          background-color: #f4aab9;
        }
      }
    }
  }

  .end {
    font-size: 1.5rem;
    color: #ea3a3a;
    margin-bottom: 3vh;
  }

  .finalScore {
    font-size: 1.2rem;
    margin-bottom: 3vh;
    span {
      color: #693aea;
    }
  }

  .total {
    font-size: 1.2rem;
    margin-bottom: 3vh;
    span {
      color: #693aea;
    }
  }

  .again {
    width: 10vw;
    height: 5vh;
    margin-bottom: 3vh;
    margin-left: 0;
    font-size: 1.2rem;
    background-color: #24546c;
    color: #fff;
    border: none;
    border-radius: 2.5vh;
    cursor: pointer;
    &:hover {
      background-color: #6e95a9;
    }
  }
</style>