<template>
  <img src="../assets/logo.jpg" @click="emit('init')">
  <header>
    <div class="chinese-name">中草药</div>
    <div class="chinese-name">知识平台</div>
    <div class="english-name" v-if="userStore.auth === 0">Knowledge Platform of Chinese Medicine</div>
    <div class="english-name manage" v-else>后 台 管 理 系 统</div>
  </header>
  <div class="orange" ref="orange"></div>
  <div class="blue" ref="blue"></div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { useUserStore } from '@/stores/user'
const props = defineProps<{
  routerChosen: boolean
}>()

const userStore = useUserStore()
const emit = defineEmits(['init'])
const orange = ref<HTMLElement>()
const blue = ref<HTMLElement>()

const init = () => {
  orange.value!.style.transform = "rotate(-20deg)"
  blue.value!.style.transform = "rotate(-60deg)"
}

const routerChosen = () => {
  orange.value!.style.transform = "rotate(0) translateX(-20vw)"
  blue.value!.style.transform = "rotate(-45deg) translate(-72vw, -50vh)"
}

watch(() => props.routerChosen, (newVal) => {
  if (newVal) {
    routerChosen()
  } else {
    init()
  }
})

</script>

<style scoped lang="less">
  img {
    display: block;
    width: 8vw;
    position: absolute;
    left: 2vw;
    top: 2vw;
    cursor: pointer;
  }

  header {
    position: absolute;
    top: 25vh;
    left: 10vw;
    z-index: 3;
    .chinese-name {
      color: #209f37;
      font-size: 6vw;
      font-weight: 600;
    }
    .english-name {
      color: #2c1b81;
      font-size: 1.8vw;
      margin-top: 2vh;
    }
    .manage {
      font-size: 2.5vw;
      font-weight: 600;
    }
  }

  .orange {
    width: 20vw;
    height: 115vh;
    position: absolute;
    left: 50vw;
    top: -8vh;
    transform: rotate(-20deg);
    background-color: #ec923f;
    border-top-left-radius: 10vw;
    border-top-right-radius: 10vw;
    z-index: 2;
    transition: all 0.5s;
  }

  .blue {
    width: 18vw;
    height: 115vh;
    position: absolute;
    right: 8vw;
    top: -25vh;
    transform: rotate(-60deg);
    background-color: #2faaaa;
    border-top-left-radius: 9vw;
    border-top-right-radius: 9vw;
    transition: all 0.5s;
  }
</style>