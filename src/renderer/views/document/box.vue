<template>
  <div class="box-man">
    <div v-if="item.typename == 'biaoti'&&typenames.length===1" class="biaoti" ref="biaoti"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:'36pt',transform:this.scale}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'biaoti'&&typenames.length!==1&&isFirst" class="biaoti-first" ref="biaoti"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:'36pt',top:((typenames.length)*55+((typenames.length-2)*10))/2+'px'}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'biaoti'&&typenames.length!==1&&!isFirst" class="biaoti-second" ref="biaoti"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:'36pt',transform:this.scale}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'biaoti1'" class="biaoti1"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'biaoti2'" class="biaoti2"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'fawejiguan'" class="fawejiguan"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'zhusongjiguan'" class="zhusongjiguan"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'zhengwen'" class="zhengwen"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'shumin'" class="shumin"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize,paddingRight: showBefore?'44px':'22px',margin: showBefore?'22px 0 0 0':'44px 0 0 0'}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'datatime'" class="datatime"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>

    <div v-if="item.typename == 'pagetag'" class="pagetagbefore">
      <div class="pagetagbefore-left"></div>
      <div class="pagetagbefore-right"></div>
    </div>
    <div v-if="item.typename == 'pagetag'" class="pagetag"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize,textAlign:showLeft?'left':'right'}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'pagetag' && showAfter" class="pageafter"></div>
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
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize,textIndent: showBefore?'5.2rem':'6.5rem'}"
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
    <div v-if="item.typename == 'cihan'" class="cihan"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'qingpishi'" class="qingpishi"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'banji'" class="banji"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'banji1'" class="banji1"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
         v-html="item.content"></div>
    <div v-if="item.typename == 'banji2'" class="banji2"
         :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
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
      showAfter(){
        return this.typenames.findIndex(item=>item.content == this.item.content) !== (this.typenames.length-1)
      },
      showLeft(){
        return this.typenames.findIndex(item=>item.content == this.item.content)%2 !== 0
      },
      showBefore(){
        return this.typenames.findIndex(item=>item.content == this.item.content) !== 0
      },
      isFirst(){
        return this.typenames.findIndex(item=>item.content == this.item.content) === 0
      },
      isSecond(){
        return this.typenames.findIndex(item=>item.content == this.item.content) === 1
      },
    },
    mounted() {
      if(this.item.typename == 'pagetag' || this.item.typename == 'shumin'||this.item.typename == 'biaoti'||this.item.typename == 'fujian'){
          this.typenames = this.list.filter(item=>{
            return item.typename == this.item.typename;
          });
      }
      this.$nextTick(()=>{
        if(this.item.typename == 'biaoti'){
          let scrollWidth = this.$refs.biaoti.scrollWidth,offsetWidth = this.$refs.biaoti.offsetWidth,
            translateX = (scrollWidth - offsetWidth)/2;
          if(this.typenames.length > 1){
            offsetWidth = this.$refs.biaoti.offsetWidth - 100;
            translateX = (scrollWidth - offsetWidth)/2+50;
          }
          if(scrollWidth <= offsetWidth) return
          let b = offsetWidth / scrollWidth;
          this.scale = `scaleX(${b}) translateX(-${translateX}px)`
        }
      })
    },
    methods: {}
  }
</script>
<style scoped lang="scss">

  .box-man {
    .biaoti {
      text-align: center;
      margin: 136px 0 20px 0;
      white-space: nowrap;
    }
    .biaoti-first{
      text-align: right;
      margin-top: 81px;
      position: relative;
      white-space: nowrap;
    }
    .biaoti-second{
      text-align: center;
      margin-bottom: 10px;
      white-space: nowrap;
    }
    /*.biaoti-not{*/
    /*  text-align: center;*/
    /*  margin-bottom: 10px;*/
    /*  white-space: nowrap;*/
    /*}*/
    .fawejiguan {
      text-align: center;
      padding-bottom: 5px;
      border: 0px solid red;
      border-bottom: 5px solid red;
      margin-bottom: 46px;
    }

    .biaoti1 {
      text-align: center;
    }
    .biaoti2 {
      text-align: center;
    }
    .zhusongjiguan {
      margin: 22px 0 0 0;
    }

    .zhengwen {
      text-indent: 2.6rem;
      line-height: 2rem;
      text-align: justify;
    }

    .shumin {
      text-align: right;
      padding-right: 22px;
      margin: 22px 0 0 0;
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
      margin-top: 100px;
      top:-30px;
      div {
        position: absolute;
        width: 25px;
        height: 25px;
        border: 1px solid gainsboro;
      }

      .pagetagbefore-left-bottom{
        left: -25px;
        border-top: none;
        border-left: none;
      }

      .pagetagbefore-right-bottom {
        right: -25px;
        border-top: none;
        border-right: none;
      }
    }
    .pagetag {
      margin-right: -25px;
      margin-left: -25px;
      padding: 0 22px;
      text-align: right;
      margin-top: 60px;
      margin-bottom: 20px;
    }
    .pageafter{
      position: absolute;
      right: 0;
      left: 0;
      background: #e6e6e6;
      height: 20px
    }

    .level1 {
      text-indent: 2.6rem;
      line-height: 2rem;
    }

    .level2 {
      text-indent: 2.6rem;
      line-height: 2rem;
    }

    .level3 {
      text-indent: 2.6rem;
      line-height: 2rem;
    }

    .level4 {
    }

    .fujian {
      margin-top: 22px;
      text-indent: 2.6rem;
    }
    .danweimingcheng {
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
    .cihan{
      text-indent: 2.6rem;
      line-height: 2.6rem;
    }
    .qingpishi{
      text-align: right;
      margin: 0 22px;
    }
    .banji {
      margin-top: 100px;
      text-align: center;
      border-bottom: 2px solid;
      border-top: 2px solid;
    }
    .banji1 {
      margin-top: 22px;
    }
    .banji2 {
      margin-top: 100px;
      text-align: center;
      padding: 10px 22px;
      border-bottom: 2px solid;
      border-top: 2px solid;
    }
  }

</style>
