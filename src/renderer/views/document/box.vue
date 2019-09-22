<template>
  <div class="box-man">
    <div ref="biaoti">
      <div>
        <div v-for="(r,index) in item.preitems" :key="index"
             :style="{...r.wordStyle,fontFamily:`Times New Roman,${r.wordStyle.fontFamily}`,minHeight: '22px'}"
             v-html="r.content"></div>
      </div>

      <div v-if="item.inline == 0" v-for="(r,index) in item.items" :key="index"
           :style="{...r.wordStyle,
                 lineHeight:r.wordStyle.lineHeight.includes('pt')?r.wordStyle.lineHeight:(r.wordStyle.lineHeight+'pt'),
                 textAlignLast: (item.type == 'biaoti')? 'justify':'',
                 textAlign: textAlign(item,r),
                 fontFamily:`Times New Roman,${r.wordStyle.fontFamily}`,
                 whiteSpace: (item.type == 'biaoti'||item.type == 'biaoti1')? 'nowrap':'',
                 minHeight: (item.type == 'fenhao'||item.type == 'mijiqixian'|| item.type == 'jinjichengdu')? r.wordStyle.lineHeight:'',
                 borderBottom: item.type == 'banji2'? '1px solid':r.wordStyle.borderTop,
                 borderTop:item.type == 'banji2'? '1px solid':r.wordStyle.borderTop,
                 }"
           ref="items">
        <div v-if="r.type=='pagetag'">
          <div class="pagetagbefore">
            <div class="pagetagbefore-left"></div>
            <div class="pagetagbefore-right"></div>
          </div>
          <div class="pagetag"
               :style="{fontFamily:r.wordStyle.fontFamily,color:r.wordStyle.color,fontSize:r.wordStyle.fontSize,textAlign:Number(r.content)%2?'right':'left'}"
          >—{{r.content}}—
          </div>
          <div v-if="showAfter!=r.content" class="pageafter"></div>
          <div v-if="showAfter!=r.content" class="pagetagafter">
            <div class="pagetagbefore-left-bottom"></div>
            <div class="pagetagbefore-right-bottom"></div>
          </div>
        </div>
        <div v-else-if="item.type=='banji2'" style="padding: 0 22px">
          <span v-html="r.content2.split(' ')[0]"></span>
          <span v-html="r.content2.split(' ')[r.content2.split(' ').length-1]" style="float: right;"></span>
        </div>
        <div v-else v-html="r.content2"></div>
      </div>
      <span v-else v-for="(r,index) in item.items" :key="index" v-html="r.content2"
            :style="{...r.wordStyle,fontFamily:`Times New Roman,${r.wordStyle.fontFamily}`,}"></span>

      <div>
        <div v-for="(r,index) in item.postitems" :key="index" v-html="r.content"
             :style="{...r.wordStyle,
             minHeight: (r.type == 'redline')? '':'22px',
             height:(r.type == 'redline')? '5px':'',
             background:(r.type == 'redline')? 'red':'',
             fontFamily:`Times New Roman,${r.wordStyle.fontFamily}`,
             }"></div>
      </div>
    </div>
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
      list: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        scale: '',
      }
    },
    computed: {
      showAfter() {
        let index = 0;
        this.list.forEach((item) => {
          item.items&&item.items.forEach(r => {
            if(r.type == 'pagetag') index++;
          });
        });
        return index;
      },
    },
    mounted() {
      this.$nextTick(() => {
        if (this.item.type == 'biaoti' || this.item.type == 'biaoti1') {
          this.$refs.items.forEach(r => {
            let scrollWidth = r.scrollWidth, offsetWidth = r.offsetWidth,
              translateX = (scrollWidth - offsetWidth) / 2;
            // if (this.typenames.length > 1) {
            //   offsetWidth = this.$refs.biaoti.offsetWidth - 100;
            //   translateX = (scrollWidth - offsetWidth) / 2 + 50;
            // }
            if (scrollWidth <= offsetWidth) return
            let b = offsetWidth / scrollWidth;
            r.style.transform = `scaleX(${b}) translateX(-${translateX}px)`
          })
        }
      })
    },
    methods: {
      textAlign(item, r) {
        switch (item.type) {
          case 'zhengwen1':
          case 'biaoti':
            return 'justify';
          case 'fawenjiguan':
            return 'center';
          default:
            return r.wordStyle.textAlign;
        }
      }
    }
  }
</script>
<style scoped lang="scss">

  .box-man {
    .biaoti {
      margin: 136px 0 20px 0;
      text-align: center;
      white-space: nowrap;
    }
    .biaoti-first {
      text-align: right;
      margin-top: 81px;
      position: relative;
      white-space: nowrap;
    }
    .biaoti-second {
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
      top: -30px;
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
      margin-top: 90px;
      top: -30px;
      div {
        position: absolute;
        width: 25px;
        height: 25px;
        border: 1px solid gainsboro;
      }

      .pagetagbefore-left-bottom {
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
      margin-bottom: 10px;
    }
    .pageafter {
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
    .cihan {
      text-indent: 2.6rem;
      line-height: 2.6rem;
    }
    .qingpishi {
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
