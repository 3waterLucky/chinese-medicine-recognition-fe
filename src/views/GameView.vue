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
        <div class="finalScore">本局得分：{{ score }}</div>
        <div class="total">您的总积分为：{{ totalScore }}</div>
        <el-button @click="restart">再来一局</el-button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
  import { getQuestion, submitScore } from '@/api/game'

  const answer = ref('')
  const options = ref<string[]>([])
  const imgSrc = ref('')
  const score = ref(0)
  const gaming = ref(true)
  const totalScore = ref(0)

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
      console.log(gameResult)
      totalScore.value = gameResult.totalScore
    }
  }

  const restart = () => {
    gaming.value = true
    score.value = 0
    refreshQuestion()
  }

  onBeforeMount(() => {
    refreshQuestion()
  })

  onBeforeUnmount(() => {
    if (gaming.value) {
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
</style>