<template>
  <div class="container" ref="header">
    <!-- <img src="./assets/logo.jpg" @click="init">
    <header>
      <div class="chinese-name">中草药</div>
      <div class="chinese-name">知识平台</div>
      <div class="english-name" v-if="userStore.auth === 0">Knowledge Platform of Chinese Medicine</div>
      <div class="english-name manage" v-else>后 台 管 理 系 统</div>
    </header>
    <div class="orange" ref="orange"></div>
    <div class="blue" ref="blue"></div> -->
    <UserHeader 
      @init="init" 
      :routerChosen="routerChosen"
      v-if="route.path === '/' || userStore.auth === 0"
    />
    <AdminHeader 
      @init="init" 
      v-else
    />
    <a class="login" @click="login" v-if="!userStore.userId && route.path !== '/login'">登 录</a>
    <div class="welcome" v-if="userStore.userId">欢迎您，{{ userStore.userName }}</div>
    <div class="view" :class="{ 'admin-view': route.path !== '/' && userStore.auth !== 0}" ref="view" v-show="showView">
      <router-view 
        class="router-view" 
        :class="{ 'admin-view': route.path !== '/' && userStore.auth !== 0}"
        @loginSuccess="init"
        @logoutSuccess="init"
      ></router-view>
    </div>
  </div>
  <nav @click="chooseRouter">
    <router-link v-if="userStore.auth === 0" :class="{ active: route.path.startsWith('/recog') }" to="/recog">图 像 识 别</router-link>
    <router-link v-if="userStore.auth === 0" :class="{ active: route.path.startsWith('/info') }" to="/info">资 料 大 全</router-link>
    <router-link v-if="userStore.auth === 0" :class="{ active: route.path.startsWith('/game') }" to="/game">识 图 游 戏</router-link>
    <router-link v-if="userStore.auth !== 0" :class="{ active: route.path.startsWith('/manageUser') }" to="/manageUser">用 户 管 理</router-link>
    <router-link v-if="userStore.auth !== 0" :class="{ active: route.path.startsWith('/manageRecog') }" to="/manageRecog">识 别 记 录</router-link>
    <router-link v-if="userStore.auth !== 0" :class="{ active: route.path.startsWith('/manageInfo') }" to="/manageInfo">资 料 管 理</router-link>
    <router-link :class="{ active: route.path.startsWith('/user') }" to="/user">个 人 中 心</router-link>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const showView = ref(false)
const header = ref<HTMLElement>()
const orange = ref<HTMLElement>()
const blue = ref<HTMLElement>()
const router = useRouter()
const route = useRoute()
const routerChosen = ref(false)

onMounted(() => {
  if (localStorage.getItem('token')) {
    userStore.setUser(JSON.parse(decodeURIComponent(atob(localStorage.getItem('token')!.split('.')[1]))))
  }
})

const chooseRouter = () => {
  showView.value = true
  routerChosen.value = true
  // orange.value!.style.transform = "rotate(0) translateX(-20vw)"
  // blue.value!.style.transform = "rotate(-45deg) translate(-72vw, -50vh)"
}

const init = () => {
  showView.value = false
  routerChosen.value = false
  // orange.value!.style.transform = "rotate(-20deg)"
  // blue.value!.style.transform = "rotate(-60deg)"
  router.push('/')
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
    // img {
    //   display: block;
    //   width: 8vw;
    //   position: absolute;
    //   left: 2vw;
    //   top: 2vw;
    //   cursor: pointer;
    // }
  }

  // header {
  //   position: absolute;
  //   top: 25vh;
  //   left: 10vw;
  //   z-index: 3;
  //   .chinese-name {
  //     color: #209f37;
  //     font-size: 6vw;
  //     font-weight: 600;
  //   }
  //   .english-name {
  //     color: #2c1b81;
  //     font-size: 1.8vw;
  //     margin-top: 2vh;
  //   }
  //   .manage {
  //     font-size: 2.5vw;
  //     font-weight: 600;
  //   }
  // }

  .welcome {
    position: absolute;
    right: 2vw;
    top: 1vh;
    color: #3d68a9;
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
      &:nth-child(1):not(&.active) {
        background-color: #ec923f;
        &:hover {
          background-color: #f0a660;
        }
      }
      &:nth-child(2):not(&.active) {
        background-color: #ea3a3a;
        &:hover {
          background-color: #ea6262;
        }
      }
      &:nth-child(3):not(&.active) {
        background-color: #7a1f8a;
        &:hover {
          background-color: #a352b1;
        }
      }
      &:nth-child(4):not(&.active) {
        background-color: #2c1b81;
        &:hover {
          background-color: #695cab;
        }
      }

      &.active {
        background-color: #eee;
        color: #209f37;
        font-weight: bold;
        text-decoration-line: underline;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: 52%;
          left: 30%;
          transform: translateY(-50%);
          width: 1vw;
          height: 1vw;
          border-radius: 1vw;
          background-color: #209f37;
        }
      }
    }
  }

  // .orange {
  //   width: 20vw;
  //   height: 115vh;
  //   position: absolute;
  //   left: 50vw;
  //   top: -8vh;
  //   transform: rotate(-20deg);
  //   background-color: #ec923f;
  //   border-top-left-radius: 10vw;
  //   border-top-right-radius: 10vw;
  //   z-index: 2;
  //   transition: all 0.5s;
  // }

  // .blue {
  //   width: 18vw;
  //   height: 115vh;
  //   position: absolute;
  //   right: 8vw;
  //   top: -25vh;
  //   transform: rotate(-60deg);
  //   background-color: #2faaaa;
  //   border-top-left-radius: 9vw;
  //   border-top-right-radius: 9vw;
  //   transition: all 0.5s;
  // }

  .view {
    position: absolute;
    right: 0;
    width: 50vw;
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .admin-view {
    width: 100%;
    height: 80vh;
  }

  .router-view {
    width: 80%;
  }
</style>
