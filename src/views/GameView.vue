<template>
  <div class="box1">
    <div class="box2">
      <template v-if="gaming">
        <div class="score">当前得分：{{ score }}</div>
        <div class="img">
          <img class="img" :src="imgSrc">
        </div>
        <ul @click="choose">
          请选出图中中草药的名称：
          <li v-for="(item, index) in options"
            class="waiting"
            :key="index"
            ref="li"
            :data-index="index">
            {{ item }}
          </li>
        </ul>
      </template>
      <template v-if="!gaming">
        <div class="end">游戏结束</div>
        <div class="finalScore">本局得分：{{ score }}</div>
        <div class="total">您的总积分为：</div>
        <el-button @click="restart">再来一局</el-button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
  import { getQuestion } from '@/api'

  const answer = ref('')
  const options = ref<string[]>([])
  const imgSrc = ref('')
  const li = ref<HTMLLIElement[]>([])
  const score = ref(0)
  const gaming = ref(true)

  const refreshQuestion = async () => {
    const data = await getQuestion()
    options.value = data.data.options
    answer.value = data.data.answer
    imgSrc.value = data.data.imgSrc
  }

  const choose = (e: MouseEvent) => {
    const index = e.target?.dataset.index
    if (options.value[index] === answer.value) {
      li.value[index].style.borderColor = 'green'
      li.value[index].style.backgroundColor = '#8bce82'
      li.value?.forEach(el => el.classList.remove('waiting'))
      score.value++
      setTimeout(() => {
        li.value[index].style.borderColor = ''
        li.value[index].style.backgroundColor = ''
        refreshQuestion()
        li.value?.forEach(el => el.classList.add('waiting'))
      }, 2000);
    } else {
      li.value[index].style.borderColor = 'red'
      li.value[index].style.backgroundColor = '#f4aab9'
      li.value[options.value.findIndex(val => val === answer.value)].style.borderColor = 'green';
      li.value[options.value.findIndex(val => val === answer.value)].style.backgroundColor = '#8bce82';
      li.value?.forEach(el => el.classList.remove('waiting'))
      setTimeout(() => {
        gaming.value = false
        // li.value.forEach(element => {
        //   element.style.borderColor = ''
        //   element.style.backgroundColor = ''
        // });
        // li.value?.forEach(el => el.classList.add('waiting'))
      }, 2000);
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
    }
  }

  .waiting:hover {
    background-color: #add8ed;
  }
</style>