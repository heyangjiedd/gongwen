<template>
  <div class="box-man">
    <div ref="biaoti">
      <div v-for="(r,index) in item.preitems" :key="index+'preitems'"
           :style="{...r.wordStyle,fontFamily:`Times New Roman,${r.wordStyle.fontFamily}`,minHeight: r.wordStyle.fontSize,}">
        <div v-if="r.type=='pagebreak'">
          <div class="pagetagbefore">
            <div class="pagetagbefore-left"></div>
            <div class="pagetagbefore-right"></div>
          </div>
          <div v-if="r.content == '1'&&output==1" class="pagetagredlinedouble">
            <div style="height: 0.8pt;background: red;margin-bottom: 3px"></div>
            <div style="height: 1.6pt;background: red;"></div>
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
      <div v-for="(r,index) in item.items" :key="index+'item'"
           :style="{...r.wordStyle,
                 lineHeight:r.wordStyle.lineHeight.includes('pt')?r.wordStyle.lineHeight:(r.wordStyle.lineHeight+'pt'),
                 textAlignLast: (item.type == 'biaoti')? 'justify':'',
                 textAlign: textAlign(item,r),
                 fontFamily:`Times New Roman,${r.wordStyle.fontFamily}`,
                 whiteSpace: (item.type == 'biaoti'||(item.type == 'biaoti1'&&r.wordStyle.wordWrap == 0))? 'nowrap':'',
                 minHeight: (item.type == 'fenhao'||item.type == 'mijiqixian'|| item.type == 'jinjichengdu')&&output!=1||(item.type=='banji2'&&!r.content2)||(item.type=='banji1'&&!r.content2)? r.wordStyle.lineHeight:'',
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
          <div v-if="r.content == '1'&&output==1" class="pagetagredlinedouble">
            <div style="height: 0.8pt;background: red;margin-bottom: 3px"></div>
            <div style="height: 1.6pt;background: red;"></div>
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
            <span v-html="r.content2.split(' ').splice(0,r.content2.split(' ').length-1).join(' ')"
                  :style="{letterSpacing:-(r.content0.split(' ')[0].length - 16)/2+'px'}"></span>
            <span v-html="r.content2.split(' ')[r.content2.split(' ').length-1]" style="float: right;"></span>
          </div>
        </div>
        <div v-else-if="item.type=='banji1'">
          <div v-if="output!=1">
            <div v-if="r.content2">
              <span v-html="r.content2.split('：')[0]+'：'" style="font-family: '黑体'"></span>
              <span v-html="r.content2.split('：')[1]" style="font-family: '方正小标宋简体'"></span>
            </div>
            <div v-else v-html="r.content2"></div>
          </div>
        </div>
        <div v-else-if="item.type=='fenhao'||item.type=='mijiqixian'||item.type=='jinjichengdu'">
          <div v-if="output==1" v-html="r.content2" :style="{position: 'relative',top:outputdisabled?'-32pt':'-64pt'}"></div>
          <div v-else v-html="r.content2"></div>
        </div>
        <div v-else-if="item.type=='fawenjiguan'">
<!--          信函格式-->
          <div v-if="output==1" style="text-align: right;">
            <div v-if="item.items.length > 1" :style="{position: 'relative'}">
              <span v-if="index===0" v-html="r.content2" :style="{marginRight: item.items[2].content2.split(' ').length> 1?'192pt':'128pt'}"></span>
              <span v-else-if="index===1" v-html="r.content2" :style="{float: 'right',position:'relative',marginRight:item.items[2].content2.split(' ').length> 1?'112pt':'48pt',top:'-'+r.wordStyle.lineHeight}"></span>
              <div v-else :style="{position: 'absolute',right: '0',top:'-'+r.wordStyle.lineHeight,width: r.content2.split(' ').length> 1?'112pt':'42pt',textAlign: 'left'}">
                    <span v-for="(i,j) in r.content2.split(' ')" :key="i+j"
                          :style="{display: 'inline-block',width: '48pt',marginRight: j%2==0?'16pt':'0',textAlign:'justify',textAlignLast:'justify'}">{{i}}</span>
              </div>
            </div>
            <div v-else v-html="r.content2"></div>
          </div>
<!--          公文格式-->
          <div v-else>
            <div v-if="item.items.length > 1">
              <div :style="{padding:'0 16pt',position: 'relative',
              top:(index===0)&&item.items[2].content2.split(' ').length> 2?Math.ceil(item.items[2].content2.split(' ').length/2-1)*32+'pt':'',
              paddingBottom:(index>1)&&item.items[2].content2.split(' ').length> 2?Math.ceil(item.items[2].content2.split(' ').length/2)*32+'pt':''}">
                <span v-if="index===0" v-html="r.content2" style="float: left"></span>
                <span v-else-if="index===1" v-html="r.content2" :style="{float: 'right',marginRight:item.items[2].content2.split(' ').length> 1?'112pt':'48pt'}"></span>
                <div v-else :style="{position: 'absolute',right: '16pt',width: r.content2.split(' ').length> 1?'112pt':'48pt',textAlign: 'left'}">
                    <span v-for="(i,j) in r.content2.split(' ')" :key="i+j"
                          :style="{display: 'inline-block',width: '48pt',marginRight: j%2==0?'16pt':'0',textAlign:'justify',textAlignLast:'justify'}">{{i}}</span>
                </div>
              </div>
            </div>
            <div v-else v-html="r.content2"></div>
          </div>
        </div>
        <div v-else-if="item.type=='biaoti'" :style="{marginTop: output==1&&index<=1?'32pt':''}">
          <div v-if="item.subtype=='multi'">
            <div v-if="index == 0" :style="{
            position: 'relative',
            float:'right',
            transform: 'scaleX(0.6) translateX(43px)',
            top:((item.items.length-1)/2 - 1/2)*r.wordStyle.ifontSize+'pt',
            }">
              <div v-if="output!=1">文&nbsp&nbsp件</div>
            </div>
            <div v-else>
              <div v-html="r.content2"></div>
            </div>
          </div>
          <div v-else>
            <div v-if="output==1" v-html="r.content2.replace(/文件$/,'')"></div>
            <div v-else v-html="r.content2"></div>
          </div>
        </div>
        <div v-else v-html="r.content2"></div>
      </div>
      <!--信函格式-->
      <div v-if="item.type =='biaoti'&&output==1" style="margin:20px -28px 0 -28px;">
        <div style="height: 1.4pt;background: red;margin-bottom: 3px"></div>
        <div style="height: 0.8pt;background: red;"></div>
      </div>
      <div v-for="(r,index) in item.postitems" :key="index+'postitems'"
           :style="{...r.wordStyle,
             minHeight: (item.type=='biaoti'&&output==1)?0:r.wordStyle.fontSize,
             fontFamily:`Times New Roman,${r.wordStyle.fontFamily}`,
             }">
        <div v-if="r.type == 'redline'&&type0==2&&output!=1" style="letter-spacing:-2px;text-align: justify;
        text-align-last: justify;white-space: nowrap;clear: both;">
          <span
            :style="{...r.wordStyle,width:'298px',display:'inline-block',background: 'red',height: '1.4pt',top: '-26px',position: 'relative'}"></span>
          <span :style="{...r.wordStyle,color:'red',top: '-21px',position: 'relative'}">★</span>
          <span
            :style="{...r.wordStyle,width:'298px',display:'inline-block',background: 'red',height: '1.4pt',top: '-26px',position: 'relative'}"></span>
        </div>
        <div v-if="r.type == 'redline'&&type0!=2&&output!=1">
          <span
            :style="{...r.wordStyle,width:'620px',display:'inline-block',background: 'red',height: '1.4pt',top: '-26px',position: 'relative'}"></span>
        </div>
        <div v-if="r.type=='pagebreak'">
          <div class="pagetagbefore">
            <div class="pagetagbefore-left"></div>
            <div class="pagetagbefore-right"></div>
          </div>
          <div v-if="r.content == '1'&&output==1" class="pagetagredlinedouble">
            <div style="height: 0.8pt;background: red;margin-bottom: 3px"></div>
            <div style="height: 1.6pt;background: red;"></div>
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
      // outputs: [{name: '文件式公文格式', value: 2}, {name: '信函式公文格式', value: 1}],
      output: {
        type: [Number, String]
      },
      // type0s:[{name: '党委', value: 2}, {name: '政府', value: 1}],
      type0: {
        type: [Number, String]
      },
      //初始状态是否是信函式
      outputdisabled: {
        type: Boolean
      }
    },
    data() {
      return {
        scale: ''
      }
    },
    computed: {
      showAfter() {
        let index = 0
        this.list.forEach((item) => {
          item.items && item.items.forEach(r => {
            if (r.type == 'pagebreak') index++
          })
          item.postitems && item.postitems.forEach(r => {
            if (r.type == 'pagebreak') index++
          })
          item.preitems && item.preitems.forEach(r => {
            if (r.type == 'pagebreak') index++
          })
        })
        return index
      }
    },
    mounted() {
      this.$nextTick(() => {
        if (this.item.type == 'biaoti' || this.item.type == 'biaoti1') {
          this.$refs.items.forEach((r, index) => {
            let scrollWidth = r.scrollWidth, offsetWidth = r.offsetWidth,
              translateX = (scrollWidth - offsetWidth) / 2
            if (scrollWidth <= offsetWidth) return
            if (this.item.subtype == 'multi' && this.output != 1) {
              scrollWidth = r.scrollWidth
              offsetWidth = r.offsetWidth - 115
              translateX = (scrollWidth - offsetWidth) / 2 * r.offsetWidth / offsetWidth
            }
            let b = offsetWidth / scrollWidth
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
            return 'justify'
          case 'fawenjiguan':
            return 'center'
          default:
            return r.wordStyle.textAlign
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .box-man {
    .pagetagbefore {
      position: relative;
      margin-top: 40px;
      top: -45px;

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
      margin-top: 131px;
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

    .pagetagredlinedouble {
      position: relative;
      top: -93px;
      padding-top: 40px;
      margin: 60px -28px 10px -28px;
    }

    .pagetag {
      margin-right: 16pt;
      margin-left: 16pt;
      text-align: right;
      margin-top: 45px;
      margin-bottom: 10px;
    }

    .pageafter {
      position: absolute;
      right: 0;
      left: 0;
      background: #e6e6e6;
      height: 20px
    }
  }

</style>
