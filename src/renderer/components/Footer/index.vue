<template>
    <div class="main">Copyright © {{year}} 基比亚（成都）教育科技有限公司  All Rights Reserved. 蜀ICP备19022144号-1</div>
</template>

<script>
    export default {
        name: "index",
        data(){
          return {
            year:new Date().getFullYear()
          }
        }
    }
</script>

<style scoped>
  .main{
    color: #9b9b9b;
    position: absolute;
    bottom: 0;
      font-size: 12px;
    text-align: center;
    width: 100%;
    padding: 30px 0;
    background: #fff;
  }
</style>
