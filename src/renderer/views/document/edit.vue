<template>
  <div class="components-container-editor" ref="container">
    <div class="content">
      <div class="left"  v-show="list.length > 0">
        <div class="btn-box top-left"></div>
        <div class="btn-box top-right"></div>
        <!--                错别字直线-->
        <div v-if="visiblePreview" v-for="(item,index) in mapPOP" :key="index" class="map-box"
             :style="{
                    borderLeft: `1px solid ${item.color}`,
                    borderBottom: `1px solid ${item.color}`,
                    left:item.x+item.width/2+'px',
                    top:item.y+item.height+3+'px',
                    right:'-11px'}">
        </div>
        <!--                文本段落-->
        <div v-for="(item,index) in list" :key="'box'+index">
          <Box :item="item"></Box>
        </div>
      </div>
      <div class="middle">
        <!--                连接折线-->
        <div v-if="visiblePreview" v-for="(item,index) in mapSX" :key="'sx'+ index" :class="item.is ? 'sx1' : 'sx2'" :style="{
                    borderTop: `1px solid ${item.is?item.color:'#fff'}`,
                    borderBottom: `1px solid ${item.is?'#fff':item.color}`,
                    borderLeft: `1px solid ${item.color}`,
                    left:item.left+'px',
                    width:item.width+'px',
                    height:item.height+'px',
                    top:item.top+3+'px',
                    position:'absolute'}">
        </div>
        <!--                错别字修正框-->
        <div v-if="visiblePreview" v-for="(item,index) in mapPOP" ref="pop" :key="'tip'+index" :style="{
                left:'40px',
                position:'relative',
                marginBottom:'5px',
                right:0}">
          <div class="cuobiezi" :style="{border:`1px solid ${item.color}`}">
            <div>
              <span :style="{color: `${item.color}`}">[{{index+1}}]、</span>
              <span>选择以下词修正：</span>
              <span v-for="(i,index) in item.coorectnames" class="ciku" @click="item.value = i" :key="index">
                           {{i}}
                        </span>
              <span>手动输入正确词:</span>
            </div>
            <el-input v-model="item.value" placeholder="请输入正确词" size="mini" clearable @keyup.enter.native=""
                      style="margin-bottom: 5px"/>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="danger" @click="sure(item.index,false)">忽略</el-button>
              <el-button size="mini" type="primary" @click="sure(item.index,true)">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <el-button style="margin-bottom: 10px" size="small" type="danger" @click.stop="$router.go(-1)">返回首页
        </el-button>
        <br/>
        <el-button style="margin-bottom: 10px" size="small" type="danger" @click.stop="visible = false">保存公文
        </el-button>
        <br/>
<!--        <el-button style="margin-bottom: 10px" size="small" type="danger" @click.stop="visiblePreview = !visiblePreview">-->
<!--          {{visiblePreview ?'预览公文':'继续编辑'}}-->
<!--        </el-button>-->
<!--        <br/>-->
        <el-popover
          width="200"
          v-model="visible">
          <p>请选择您要导出的公文版本</p>
          <div style="text-align: right; margin: 0">
            <el-popover
              width="200"
              v-model="visiblePZ">
              <p>请选择您要导出的批注公文版本</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="danger" @click.stop="downloadWord">Word版</el-button>
                <el-button size="mini" type="danger" @click.stop="downloadPDF">PDF版</el-button>
              </div>
              <el-button type="danger" size="mini" slot="reference" @click.stop>正式版</el-button>
            </el-popover>
            <el-button size="mini" type="danger" @click.stop="download">批注版</el-button>
          </div>
          <el-button type="danger" size="mini" slot="reference" @click.stop>导出公文</el-button>
        </el-popover>
      </div>
    </div>
    <Tooltip v-if="item.show" :left="item.left" :top="item.top" @canel="canel" @sure="sure"></Tooltip>
  </div>
</template>

<script>
  import {getByPath, getsuggestWord, wordformat, getmistakewordHtml, reviseToWord, getByWord} from '@/api/fileupload'
  import Tooltip from './tooltip'
  import Box from './box'

  export default {
    name: 'TinymceDemo',
    components: {Tooltip, Box},
    data() {
      return {
        color: ['#00FFFF', '#FFD700', '#0000FF', '#A52A2A', '#5F9EA0', '#D2691E', '#DC143C', '#B8860B', '#006400'],
        visible: false,
        visiblePZ: false,
        visiblePreview:true,
        content: '',
        list: [],//文本板块
        mapPOP: [],//错别字库
        mapSX: [],//连接折线
        item: {show: false, left: 0, top: 0, id: null}
      }
    },
    mounted() {
      this.getDetail()
      // wordformat({filepath:this.$route.query.path+'_jy.docx',layout:'html'}).then(res => {
      //     this.content = res.wordHtml
      // }).catch(res=>{
      //     this.$router.go(-1)
      // });
    },
    methods: {
      getDetail() {
        this.list = []
        getByWord({filepath: this.$route.query.path}).then(res => {
          let index = 0;
          this.list = res.word.map((item) => {
            let list = item.content.split(/---@([^@#]+)#---/).filter(item=>item);
            let content = item.content.replace(/---@([^@#]+)#---/gm, (a, b) => {
              return `<span class="error" style="border-bottom: 1px dashed ${this.color[index%this.color.length]}">${b}
<span class="num" data-index="${index}" data-coorectnames=${item.coorectnames[b]} style="font-size: 12px;color: ${this.color[index%this.color.length]}">[${++index}]</span></span>`
            })
            return {...item, content}
          })
          this.$nextTick(() => {
            this.setItemTips()
          })
        }).catch(res => {
          this.$message.error('获取失败')
        })
      },
      sure(index,is){

      },
      setItemTips() {
        let s = window.document.getElementsByClassName('num')
        this.mapPOP = [];
        [...s].forEach((item, index) => {
          let data = {
            index:item.getAttribute('data-index'),
            value: '',
            coorectnames:item.getAttribute('data-coorectnames').split(','),
            x: item.offsetLeft,
            y: item.offsetTop,
            height: item.offsetHeight,
            width: item.offsetWidth,
            color: this.color[index%this.color.length],
          }
          if (this.mapPOP.find(r => {
            return data.y == r.y
          })) {
            data.y = data.y + 1
          }
          this.mapPOP.push(data)
        })
        this.$nextTick(() => {
          this.mapSX = [...this.$refs.pop].map((item, index) => {
            let pop = this.mapPOP[index].y + this.mapPOP[index].height
            let sx = item.offsetTop + item.offsetHeight / 2
            let is = pop > sx
            let height = is ? pop - sx : sx - pop
            let top = is ? sx : pop
            return {width: 30, left: 10, top: top + 5, height: height, is, color: this.color[index%this.color.length],}
          })
        })
      },
      showToop(item) {
        this.item = {
          left: item.offsetLeft + 30 + 'px',
          top: item.offsetTop + 'px',
          id: item.id,
          show: true
        }
      },
      sure(revise) {
        let data = this.list.find(item => item.id == this.item.id)
        reviseToWord({paramlist: [{...data, revise}], pzname: this.$route.query.path}).then(res => {
          this.$message.success('修改成功')
          this.getDetail()
          this.canel()
        })
      },
      canel() {
        this.item.show = false
      },
      download() {
        this.visible = false
        this.downloadCommon('.docx')
      },
      downloadWord() {
        this.visible = false
        this.visiblePZ = false
        this.downloadCommon('_zs.docx')
      },
      downloadPDF() {
        this.visible = false
        this.visiblePZ = false
        this.downloadCommon('_zs.pdf')
      },
      downloadCommon(url) {
        const ele = document.createElement('a')
        ele.setAttribute('href', `${this.baseUrl}doc/${this.$route.query.path}${url}`) //设置下载文件的url地址
        ele.click()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .components-container-editor {
    background: #ffffff;
    padding: 20px;
    min-width: 1080px;

    .content {
      display: flex;
      position: relative;

      .left {
        width: 635px;
        position: relative;
        border: 1px solid gainsboro;
        padding: 20px 20px 20px 20px;

        .map-box {
          position: absolute;
          overflow: auto;
          height: 4px;
        }

        .btn-box {
          position: absolute;
          width: 25px;
          height: 25px;
          border: 1px solid gainsboro;
        }

        .top-left {
          border-left: none;
          border-top: none;
        }

        .top-right {
          right: 20px;
          border-right: none;
          border-top: none;
        }

        .bottom-left {
          top: 700px;
          border-bottom: none;
          border-left: none;
        }

        .bottom-right {
          top: 700px;
          right: 20px;
          border-bottom: none;
          border-right: none;
        }
      }

      .middle {
        width: 300px;
        position: relative;

        .cuobiezi {
          background: #fff;
          width: 250px;
          padding: 3px;
          border-radius: 4px;
          color: gainsboro;
          line-height: 1.4;
          font-size: 12px;
        }

        .ciku {
          cursor: pointer;
          color: black;

          &:hover {
            color: #66b1ff;
          }
        }

        .tips {
          bottom: -6px;
          margin-right: 3px;
          border-top-color: #ebeef5;
          border-bottom-width: 0;

          &:after {
            bottom: 1px;
            margin-left: -6px;
            border-top-color: #fff;
            border-bottom-width: 0;
            content: " ";
            border-width: 6px;
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
          }
        }
      }

      .right {
        position: absolute;
        right: 0;
        min-width: 100px;
      }
    }

    .main {
      .content {
        width: 1000px;
      }

      .pizhu {
        float: right;
        width: 200px;
      }

      .btn {
        float: right;
        width: 100px;
      }
    }
  }
</style>
