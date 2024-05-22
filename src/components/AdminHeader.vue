<template>
  <header>
    <div class="orange"></div>
    <div class="blue"></div>
    <span>中草药知识平台后台管理系统</span>
    <img src="../assets/logo.jpg" @click="emit('init')">
  </header>
</template>

<script setup lang="ts">
const emit = defineEmits(['init'])
</script>

<style scoped lang="less">
header {
position: relative;
width: 100%;

  .orange {
    width: 100%;
    height: 5vh;
    background: linear-gradient(to right, #fff 10%, #ec923f 50%);
  }

  .blue {
    width: 100%;
    height: 5vh;
    background: linear-gradient(to right, #fff 10%, #2faaaa 50%);
  }

  span {
    position: absolute;
    font-size: 5vh;
    top: 1vh;
    left: calc(4vw + 10vh);
    color: #fff;
    text-shadow: 0 0 5px #000;
  }

  img {
    display: block;
    height: 10vh;
    position: absolute;
    left: 2vw;
    top: 1vh;
    cursor: pointer;
    background-color: transparent;
  }
}
</style>