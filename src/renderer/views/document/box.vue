<template>
  <div class="box-man">
    <div ref="biaoti">
      <div v-for="(r,index) in item.preitems" :key="index+'preitems'"
           :style="{...r.wordStyle,fontFamily:`Times New Roman,${r.wordStyle.fontFamily}`,minHeight: '22px'}">
        <div v-if="r.type=='pagebreak'">
          <div v-if="r.content == '1'&&output==1">
            <div style="height: 0.7pt;background: red;margin-bottom: 3px"></div>
            <div style="height: 1.4pt;background: red;"></div>
          </div>
          <div class="pagetagbefore">
            <div class="pagetagbefore-left"></div>
            <div class="pagetagbefore-right"></div>
          </div>
          <div class="pagetag"
               :style="{fontFamily:r.wordStyle.fontFamily,color:r.wordStyle.color,fontSize:r.wordStyle.fontSize,textAlign:Number(r.content)%2?'right':'left'}"
          >—&nbsp{{r.content}}&nbsp—
          </div>
          <div v-if="showAfter!=r.content" class="pageafter"></div>
          <div v-if="showAfter!=r.content" class="pagetagafter">
            <div class="pagetagbefore-left-bottom"></div>
            <div class="pagetagbefore-right-bottom"></div>
          </div>
        </div>
        <div v-else v-html="r.content"></div>
      </div>
      <div v-for="(r,index) in item.items" :key="index+'item'"
           :style="{...r.wordStyle,
                 lineHeight:r.wordStyle.lineHeight.includes('pt')?r.wordStyle.lineHeight:(r.wordStyle.lineHeight+'pt'),
                 textAlignLast: (item.type == 'biaoti')? 'justify':'',
                 textAlign: textAlign(item,r),
                 fontFamily:`Times New Roman,${r.wordStyle.fontFamily}`,
                 whiteSpace: (item.type == 'biaoti'||(item.type == 'biaoti1'&&r.wordStyle.wordWrap == 0))? 'nowrap':'',
                 minHeight: (item.type == 'fenhao'||item.type == 'mijiqixian'|| item.type == 'jinjichengdu')&&output!=1||(item.type=='banji2'&&!r.content2&&output!=1)? r.wordStyle.lineHeight:'',
                 borderBottom: item.type == 'banji2'&&r.content2!=''&&output!=1? '1px solid':r.wordStyle.borderTop,
                 borderTop:item.type == 'banji2'&&r.content2!=''&&output!=1? '1px solid':r.wordStyle.borderTop,
                 borderLeft:item.type == 'banji2'&&r.content2!=''&&output!=1? '1px solid #fff':r.wordStyle.borderLeft,
                 borderRight:item.type == 'banji2'&&r.content2!=''&&output!=1? '1px solid #fff':r.wordStyle.borderRight,
                 }"
           ref="items">
        <div v-if="r.type=='pagebreak'">
          <div class="pagetagbefore">
            <div class="pagetagbefore-left"></div>
            <div class="pagetagbefore-right"></div>
          </div>
          <div v-if="r.content == '1'&&output==1" class="pagetag" style="padding-top: 40px">
            <div style="height: 0.7pt;background: red;margin-bottom: 3px"></div>
            <div style="height: 1.4pt;background: red;"></div>
          </div>
          <div v-else class="pagetag"
               :style="{fontFamily:r.wordStyle.fontFamily,color:r.wordStyle.color,fontSize:r.wordStyle.fontSize,textAlign:Number(r.content)%2?'right':'left'}"
          >—&nbsp{{r.content}}&nbsp—
          </div>
          <div v-if="showAfter!=r.content" class="pageafter"></div>
          <div v-if="showAfter!=r.content" class="pagetagafter">
            <div class="pagetagbefore-left-bottom"></div>
            <div class="pagetagbefore-right-bottom"></div>
          </div>
        </div>
        <div v-else-if="item.type=='banji2'">
          <div v-if="output!=1" :style="{padding:'0 16pt'}">
            <span v-html="r.content2.split(' ').splice(0,r.content2.split(' ').length-1).join(' ')" :style="{letterSpacing:-(r.content0.split(' ')[0].length - 16)/2+'px'}">></span>
            <span v-html="r.content2.split(' ')[r.content2.split(' ').length-1]" style="float: right;"></span>
          </div>
        </div>
        <div v-else-if="item.type=='banji1'">
          <div v-if="output!=1">
            <div v-html="r.content2"></div>
          </div>
        </div>
        <div v-else-if="item.type=='fenhao'||item.type=='mijiqixian'||item.type=='jinjichengdu'">
          <div v-if="output==1" v-html="r.content2" :style="{position: 'relative',top:outputdisabled?'-32pt':'-64pt'}"></div>
          <div v-else v-html="r.content2"></div>
        </div>
        <div v-else-if="item.type=='fawenjiguan'">
          <div v-if="output==1"  v-html="r.content2" style="text-align: right"></div>
          <div v-else v-html="r.content2"></div>
        </div>
        <div v-else-if="item.type=='biaoti'" :style="{marginTop: output==1&&index<=1?'96pt':''}">
          <div v-if="item.subtype=='multi'">
            <div v-if="index == 0" :style="{
            position: 'relative',
            float:'right',
            transform: 'scaleX(0.6) translateX(43px)',
            top:((item.items.length-1)/2 - 1/2)*r.wordStyle.ifontSize+'pt',
            }">
              <div v-html="r.content2"></div>
            </div>
            <div v-else >
              <div v-html="r.content2"></div>
            </div>
          </div>
          <div v-else v-html="r.content2"></div>
        </div>
        <div v-else v-html="r.content2"></div>
      </div>
      <!--信函格式-->
      <div v-if="item.type =='biaoti'&&output==1" style="margin-top: 20px;">
        <div style="height: 1.4pt;background: red;margin-bottom: 3px"></div>
        <div style="height: 0.7pt;background: red;"></div>
      </div>
      <div v-for="(r,index) in item.postitems" :key="index+'postitems'"
           :style="{...r.wordStyle,
             minHeight: '22px',
             // minHeight: (r.type == 'redline'&&output!=1)? '':'22px',
             // height:(r.type == 'redline'&&output!=1)? '1.4pt':'',
             // background:(r.type == 'redline'&&output!=1)? 'red':'',
             fontFamily:`Times New Roman,${r.wordStyle.fontFamily}`,
             }">
        <div v-if="r.type == 'redline'&&type0==2&&output!=1">
          <span :style="{...r.wordStyle,width:'290px',display:'inline-block',background: 'red',height: '1.4pt',top: '-8px',position: 'relative'}"></span>
          <span :style="{...r.wordStyle,color:'red'}">★</span>
          <span :style="{...r.wordStyle,width:'290px',display:'inline-block',background: 'red',height: '1.4pt',top: '-8px',position: 'relative'}"></span>
        </div>
        <div v-if="r.type == 'redline'&&type0!=2&&output!=1">
          <span :style="{...r.wordStyle,width:'613px',display:'inline-block',background: 'red',height: '1.4pt',top: '-8px',position: 'relative'}"></span>
        </div>
        <div v-if="r.type=='pagebreak'">
          <div class="pagetagbefore">
            <div class="pagetagbefore-left"></div>
            <div class="pagetagbefore-right"></div>
          </div>
          <div v-if="r.content == '1'&&output==1" class="pagetag" style="padding-top: 40px">
            <div style="height: 0.7pt;background: red;margin-bottom: 3px"></div>
            <div style="height: 1.4pt;background: red;"></div>
          </div>
          <div v-else class="pagetag"
               :style="{fontFamily:r.wordStyle.fontFamily,color:r.wordStyle.color,fontSize:r.wordStyle.fontSize,textAlign:Number(r.content)%2?'right':'left'}"
          >—&nbsp{{r.content}}&nbsp—
          </div>
          <div v-if="showAfter!=r.content" class="pageafter"></div>
          <div v-if="showAfter!=r.content" class="pagetagafter">
            <div class="pagetagbefore-left-bottom"></div>
            <div class="pagetagbefore-right-bottom"></div>
          </div>
        </div>
        <div v-else v-html="r.content"></div>
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
      },
      output: {
        type: [Number,String],
      },
      type0:{
        type: [Number,String],
      },
      outputdisabled:{
        type: Boolean,
      }
    },
    data() {
      return {
        scale: '',
      }
    },
    computed: {
      showAfter() {
        let index = 1;
        this.list.forEach((item) => {
          item.items && item.items.forEach(r => {
            if (r.type == 'pagebreak') index++;
          });
          item.postitems && item.postitems.forEach(r => {
            if (r.type == 'pagebreak') index++;
          });
          item.preitems && item.preitems.forEach(r => {
            if (r.type == 'pagebreak') index++;
          });
        });
        return index;
      },
    },
    mounted() {
      this.$nextTick(() => {
        if (this.item.type == 'biaoti'||this.item.type == 'biaoti1') {
          this.$refs.items.forEach((r,index) => {
            let scrollWidth = r.scrollWidth, offsetWidth = r.offsetWidth,
              translateX = (scrollWidth - offsetWidth) / 2;
            if (scrollWidth <= offsetWidth) return
            if (this.item.subtype=='multi') {
              scrollWidth = r.scrollWidth;
              offsetWidth = r.offsetWidth - 100;
              translateX = (scrollWidth - offsetWidth) / 2 * r.offsetWidth/ offsetWidth;
            }
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
        border-bottom: 1px solid #fff;
        border-left: 1px solid #fff;
      }

      .pagetagbefore-right {
        right: -25px;
        border-bottom: 1px solid #fff;
        border-right: 1px solid #fff;
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
        border-top: 1px solid #fff;
        border-left: 1px solid #fff;
      }

      .pagetagbefore-right-bottom {
        right: -25px;
        border-top: 1px solid #fff;
        border-right: 1px solid #fff;
      }
    }
    .pagetag {
      margin-right: 16pt;
      margin-left:  16pt;
      text-align: right;
      margin-top: 60px;
      margin-bottom: 10px;
    }
    .pageafter {
      position: absolute;
      right: 0;
      left: 0;
      background: #e6e6e6;
      height: 15px
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
