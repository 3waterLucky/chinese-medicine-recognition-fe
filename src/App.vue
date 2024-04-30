<template>
  <div class="container" ref="header">
    <img src="./assets/logo.jpg" @click="init">
    <header>
      <div class="chinese-name">中草药</div>
      <div class="chinese-name">知识平台</div>
      <div class="english-name">Knowledge Platform of Chinese Medicine</div>
    </header>
    <a class="login" @click="login">登 录</a>
    <div class="orange" ref="orange"></div>
    <div class="blue" ref="blue"></div>
    <div class="view" ref="view" v-show="showView">
      <router-view class="router-view" @loginSuccess="init"></router-view>
    </div>
  </div>
  <nav @click="chooseRouter">
    <router-link to="/recog">图 像 识 别</router-link>
    <router-link to="/game">识 图 游 戏</router-link>
    <router-link to="/info">资 料 大 全</router-link>
    <router-link to="user">用 户 信 息</router-link>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'

const showView = ref(false)
const header = ref<HTMLElement>()
const orange = ref<HTMLElement>()
const blue = ref<HTMLElement>()
const router = useRouter()

const chooseRouter = () => {
  showView.value = true
  orange.value!.style.transform = "rotate(0) translateX(-20vw)"
  blue.value!.style.transform = "rotate(-45deg) translate(-72vw, -50vh)"
}

const init = () => {
  showView.value = false
  orange.value!.style.transform = "rotate(-20deg)"
  blue.value!.style.transform = "rotate(-60deg)"
}

const login = () => {
  chooseRouter()
  router.push('/login')
}

</script>

<style lang="less" scoped>
  .container {
    width: 100vw;
    height: 90vh;
    position: relative;
    overflow: hidden;
    height: 90vh;
    img {
      display: block;
      width: 8vw;
      position: absolute;
      left: 2vw;
      top: 2vw;
    }
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
  }

  .login {
    display: block;
    position: absolute;
    right: 2vw;
    top: 2vw;
    width: 4vw;
    height: 2vw;
    background-color: #209f37;
    color: #fff;
    line-height: 2vw;
    text-align: center;
    border-radius: 0.5vw; 
    font-size: 1vw;
    z-index: 3;
    &:hover {
      background-color: #4eb761;
    }
  }

  nav {
    width: 100%;
    display: flex;
    position: sticky;
    top: 0;
    a {
      display: block;
      width: 25%;
      height: 10vh;
      line-height: 10vh;
      text-align: center;
      font-size: 1.5vw;
      color: #fff;
      &:nth-child(1) {
        background-color: #ec923f;
        &:hover {
          background-color: #f0a660;
        }
      }
      &:nth-child(2) {
        background-color: #ea3a3a;
        &:hover {
          background-color: #ea6262;
        }
      }
      &:nth-child(3) {
        background-color: #7a1f8a;
        &:hover {
          background-color: #a352b1;
        }
      }
      &:nth-child(4) {
        background-color: #2c1b81;
        &:hover {
          background-color: #695cab;
        }
      }
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

  .view {
    position: absolute;
    right: 0;
    width: 50vw;
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .router-view {
    width: 80%;
  }
</style>
