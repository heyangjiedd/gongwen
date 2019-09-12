<template>
  <div class="box-man">
    <div v-if="item.typename == 'biaoti'" class="biaoti" ref="biaoti"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:'36pt',transform:this.scale}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'biaoti'" class="biaoti"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:'36pt'}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'fawejiguan'" class="fawejiguan"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'biaoti1'" class="biaoti1"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'zhusongjiguan'" class="zhusongjiguan"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'zhengwen'" class="zhengwen"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'shumin'" class="shumin"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'datatime'" class="datatime"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>

    <div v-if="item.typename == 'pagetag'" class="pagetagbefore">
      <div class="pagetagbefore-left"></div>
      <div class="pagetagbefore-right"></div>
    </div>
    <div v-if="item.typename == 'pagetag'" class="pagetag"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'pagetag' && showAfter" style="background: #e6e6e6;height: 20px"></div>
    <div v-if="item.typename == 'pagetag' && showAfter" class="pagetagafter">
      <div class="pagetagbefore-left-bottom"></div>
      <div class="pagetagbefore-right-bottom"></div>
    </div>

    <div v-if="item.typename == 'level1'" class="level1"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'level2'" class="level2"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'level3'" class="level3"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'level4'" class="level4"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'fujian'" class="fujian"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'danweimingcheng'" class="danweimingcheng"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'chengwenriqi'" class="chengwenriqi"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'chuxi'" class="chuxi"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'zhengli'" class="zhengli"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'banji'" class="banji"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize,}"
         v-html="item.content"></div>
  </div>
</template>

<script>
  export default {
    name: 'box',
    props: {
      item: {
        type: Object,
        default: () => {
        }
      },
      list:{
        type: Array,
        default: () => []
      }
    },
    data(){
      return {
        typenames:[],
        scale:'',
      }
    },
    computed:{
      showBefore(){

      },
      showAfter(){
        return this.typenames.findIndex(item=>item.content == this.item.content) !== (this.typenames.length-1)
      }
    },
    mounted() {
      if(this.item.typename == 'pagetag'){
          this.typenames = this.list.filter(item=>{
            return item.typename == this.item.typename;
          });
      }
      this.$nextTick(()=>{
        // if(this.item.typename == 'biaoti'){
        //   if(this.$refs.biaoti.scrollWidth <= this.$refs.biaoti.offsetWidth) return
        //   let b = this.$refs.biaoti.offsetWidth / this.$refs.biaoti.scrollWidth;
        //   this.scale = `scaleX(${b})  translateX(-${(this.$refs.biaoti.scrollWidth -this.$refs.biaoti.offsetWidth)/2}px)`
        // }
      })

    },
    methods: {}
  }
</script>
<style scoped lang="scss">

  .box-man {
    .biaoti {
      text-align: center;
      margin: 90px 0 20px 0;
      white-space: nowrap;
      /*overflow: hidden;*/
      /*font-stretch: extra-condensed;*/
    }

    .fawejiguan {
      text-align: center;
      padding-bottom: 5px;
      border-bottom: 4px solid red;
    }

    .biaoti1 {
      margin: 20px 0 10px 0;
      text-align: center;
    }

    .zhusongjiguan {
      margin: 10px 0 0 0;
      text-indent: 2rem;
      line-height: 2rem;
    }

    .zhengwen {
      text-indent: 2rem;
      line-height: 2rem;
    }

    .shumin {
      text-align: right;
      margin: 10px 0;
    }

    .datatime {
      text-align: right;
      margin: 10px 0;
    }

    .pagetagbefore {
      position: relative;
      margin-top: 40px;
      top:-30px;
      div {
        position: absolute;
        width: 25px;
        height: 25px;
        border: 1px solid gainsboro;
      }

      .pagetagbefore-left {
        left: -25px;
        border-bottom: none;
        border-left: none;
      }

      .pagetagbefore-right {
        right: -25px;
        border-bottom: none;
        border-right: none;
      }
    }
    .pagetagafter {
      position: relative;
      margin-top: 80px;
      top:-30px;
      div {
        position: absolute;
        width: 25px;
        height: 25px;
        border: 1px solid gainsboro;
      }

      .pagetagbefore-left-bottom{
        border-top: none;
        border-left: none;
      }

      .pagetagbefore-right-bottom {
        right: 20px;
        border-top: none;
        border-right: none;
      }
    }
    .pagetag {
      margin-right: -25px;
      text-align: right;
      margin-top: 60px;
      margin-bottom: 20px;
    }

    .level1 {
      text-indent: 2rem;
      line-height: 2rem;
    }

    .level2 {
      text-indent: 2rem;
      line-height: 2rem;
    }

    .level3 {
      text-indent: 2rem;
      line-height: 2rem;
    }

    .level4 {
    }

    .fujian {
      margin-top: 20px;
    }

    .danweimingcheng {
      text-align: right;
      margin: 10px 0;
    }

    .chengwenriqi {
      text-align: right;
      margin: 10px 0;
    }

    .chuxi {
      text-indent: 2rem;
      line-height: 2rem;
    }
    .zhengli {
      text-indent: 2rem;
      line-height: 2rem;
    }
    .banji {
      margin-top: 100px;
      text-align: center;
      border-bottom: 2px solid;
      border-top: 2px solid;
    }
  }

</style>
