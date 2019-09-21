<template>
  <div class="components-container-editor" ref="container">
    <div class="filter-container">
      <el-button size="small" type="danger" @click.stop="$router.go(-1)"><i
        class="el-icon-arrow-left el-icon--left"/>返回
      </el-button>
      <el-select
        v-model="fontFamily"
        size="small"
        placeholder="正文字体选择"
        style="margin-left: 10px;width: 130px"
      >
        <el-option v-for="item in fontFamilys" :key="item" :value="item" :label="item"/>
      </el-select>
      <el-input
        style="width: 80px"
        placeholder="份号"
        @blur="oneBlur"
        :maxlength="6"
        size="small"
        v-model="three.one">
      </el-input>
      <el-select
        v-model="three.fou"
        size="small"
        placeholder="密级"
        style="width: 80px"
      >
        <el-option v-for="item in threefou" :key="item" :value="item" :label="item"/>
      </el-select>
      <el-input placeholder="时长" size="small" v-model="three.fiv" style="width: 80px">
      </el-input>
      <el-select
        v-model="three.six"
        size="small"
        placeholder="单位"
        style="width: 80px"
      >
        <el-option v-for="item in threefiv" :key="item" :value="item" :label="item"/>
      </el-select>
      <el-select
        v-model="three.thr"
        size="small"
        placeholder="紧急程度"
        style="width: 100px"
      >
        <el-option v-for="item in threethr" :key="item" :value="item" :label="item"/>
      </el-select>
      <el-select
        v-model="output"
        size="small"
        placeholder="转为函格式"
        style="width: 120px"
      >
        <el-option v-for="item in outputs" :key="item.value" :value="item.value" :label="item.name"/>
      </el-select>
    </div>
    <div class="content" id="content">
      <div class="left" v-show="list.length > 0">
        <div class="btn-box top-left"></div>
        <div class="btn-box top-right"></div>
        <!--                错别字直线-->
        <div v-if="visiblePreview" v-for="(item,index) in mapPOP" :key="index" class="map-box"
             :style="{
                    borderRight:'0px dashed #fff',
                    borderTop: '0px dashed #fff',
                    borderLeft: `1px dashed #b4373b`,
                    borderBottom: `1px dashed #b4373b`,
                    left:item.x+item.width+'px',
                    top:item.y+item.height+'px',
                    right:'-11px'}">
        </div>
        <!--                文本段落-->
        <div v-for="(item,index) in list" :key="_uuid()">
          <Box :item="item" :list="list"></Box>
        </div>
      </div>
      <div class="middle">
        <!--                连接折线-->
        <div v-if="visiblePreview" v-for="(item,index) in mapSX" :key="'sx'+ index"
             :class="item.is ? 'sx1' : 'sx2'" :style="{
                    borderRight:'0px dashed #fff',
                    borderTop: `1px dashed ${item.is?'#b4373b':'#fff'}`,
                    borderBottom: `1px dashed ${item.is?'#fff':'#b4373b'}`,
                    borderLeft: `1px dashed ${'#b4373b'}`,
                    left:item.left+'px',
                    width:item.width+'px',
                    height:item.height+'px',
                    top:item.top+'px',
                    position:'absolute'}">
        </div>
        <!--                错别字修正框-->
        <div v-if="visiblePreview" v-for="(item,index) in mapPOP" ref="pop" :key="'tip'+index" :style="{
                left:'40px',
                position:'relative',
                marginBottom:'5px',
                right:0}">
          <div class="cuobiezi" :style="{border:`1px solid #b4373b`}">
            <div>
              <div style="font-weight: 500;margin-bottom: 5px">批注[{{index+1}}] 【{{item.val}}】</div>
              <div style="margin-bottom: 5px"><span >选择正确词：</span>
                <span style="color: #b4373b;margin-right: 5px" v-for="(i,index) in errorList[item.val].coorectname.split(',')" class="ciku"
                      @click="item.value = i" :key="index">{{i}}</span></div>
              <div  style="margin-bottom: 5px"><span>输入正确词：</span><input v-model="item.value"
                                                                         style="border:none;border-bottom:1px solid;background: #efdbdc;width: 170px" type="text"></div>
            </div>
            <div style="text-align: right; margin: 0;font-size: 13px;">
              <span @click="sure(item.index,item.val)" style="cursor: pointer;margin-right: 8px">[<span style="font-size: 12px">忽略</span>]
              </span>
              <span @click="sure(item.index,item.value)" style="cursor:pointer ">[<span style="font-size: 12px">确定</span>]
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <el-button style="margin-bottom: 5px" size="small" type="danger" @click.stop="createPicture">导出批注版
        </el-button>
        <br/>
        <el-button style="width: 92px;text-align: center" size="small" type="danger"
                   @click.stop="save"> {{output === 1 ?'保 存 公 文':'保 存 函'}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getByPath,
    getsuggestWord,
    wordformat,
    getmistakewordHtml,
    reviseToWord,
    getByWord,
    saveWord
  } from '@/api/fileupload'
  import Tooltip from './tooltip'
  import Box from './box'
  import html2canvas from 'html2canvas'
  import {Loading} from 'element-ui'

  export default {
    name: 'TinymceDemo',
    components: {Tooltip, Box},
    data() {
      return {
        color: ['#00FFFF', '#FFD700', '#0000FF', '#A52A2A', '#5F9EA0', '#D2691E', '#DC143C', '#B8860B', '#006400'],
        visible: false,
        visiblePZ: false,
        visiblePreview: true,
        content: '',
        oldList: [],
        errorList: {},//错别字列表
        list: [],//文本板块
        mapPOP: [],//错别字库
        mapSX: [],//连接折线
        replace: [],
        three: {
          one: '',
          two: '',
          thr: '',
          fou: '',
          fiv: '',
          six: '',
        },
        threethr: ['特急', '加急', '平急'],
        threefou: ['绝密', '机密', '秘密'],
        threefiv: ['年', '月'],
        fontFamilys: ['仿宋简体', '仿宋GBK', '仿宋_GB2312'],
        fontFamily: '',
        outputs: [{name: '是', value: 2}, {name: '否', value: 1}],
        output: 1,
      }
    },
    mounted() {
      this.getDetail()
    },
    watch: {
      fontFamily(newVal) {
        this.setList()
      },
      'three.fou'() {
        if (this.three.fou && this.three.fiv && this.three.six) {
          this.three.two = this.three.fou + '★' + this.three.fiv + this.three.six;
        }
      },
      'three.fiv'() {
        if (this.three.fou && this.three.fiv && this.three.six) {
          this.three.two = this.three.fou + '★' + this.three.fiv + this.three.six;
        }
      },
      'three.six'() {
        if (this.three.fou && this.three.fiv && this.three.six) {
          this.three.two = this.three.fou + '★' + this.three.fiv + this.three.six;
        }
      },
      'three.one'() {
        this.oldList = this.oldList.map(item=>{
          return {
            ...item,
            content2:item.type === 'fenhao'?this.three.one:item.content2,
          }
        })
      },
      'three.two'() {

      },
      'three.thr'() {

      },
    },
    methods: {
      oneBlur() {
        this.three.one = (Array(6).join('0') + this.three.one).slice(-6);
      },
      createPicture() {
        let dom = document.getElementById('content')
        let loadingInstance = Loading.service({
          text: '正在导出，请勿操作',
          background: 'rgba(0, 0, 0, 0.28)',
          spinner: 'el-icon-loading',
        });
        html2canvas(dom, {
          allowTaint: true
        }).then(canvas => {
          this.imgmap = canvas.toDataURL('image/', 'png')
          if (window.navigator.msSaveOrOpenBlob) {
            var bstr = atob(this.imgmap.split(',')[1])
            var n = bstr.length
            var u8arr = new Uint8Array(n)
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n)
            }
            var blob = new Blob([u8arr])
            window.navigator.msSaveOrOpenBlob(blob, 'chart-download' + '.' + 'png')
          } else {
            const a = document.createElement('a')
            a.href = this.imgmap
            a.setAttribute('download', this.$route.query.path + '.png')
            loadingInstance.close();
            a.click()
          }
        })
      },
      save() {
        if (this.mapPOP.length > 0) {
          this.$message.error('请先处理完毕再保存！')
          return
        }
        let wordcontentList = [...this.list]
        wordcontentList.reverse()
        let index = wordcontentList.findIndex(item => item.typename == 'shumin')
        if (index != -1) {
          wordcontentList.splice(index, 0, {typename: 'shumin', content: ''})
        }
        wordcontentList.reverse()
        let data = {
          wordcontent: wordcontentList.map(item => {
            return {[item.typename]: item.content}
          }),
          filepath: this.$route.query.path,
          han: [this.three.one || '', this.three.two || '', this.three.thr || ''],
          status: this.output,
          fontstyle: this.fontFamily
        }
        saveWord(data).then(res => {
          this.$message.success('保存成功')
          this.$router.go(-1)
        })
      },
      getDetail() {
        getByWord({filepath: this.$route.query.path}).then(res => {
          this.oldList = res.word.list || [];
          this.errorList = res.word.wordMap
          this.setList()
        })
      },
      sure(index, valvue) {
        this.replace.push({index, valvue})
        this.setList()
      },
      setList() {
        this.list = []
        let index = 0;
        this.list = this.oldList.map((item) => {
          item.items = item.items.map(r => {
            let content2 = r.content1.replace(/---@([^@#]+)#---/gm, (a, b) => {
              let replace = this.replace.find(n => n.index == index)
              if (replace) {
                index++
                return replace.valvue
              }
              return `<span class="error" data-index="${index}" data-val="${b}" style="background:#efdbdc;border: 1px solid #b4373b; border-top:0px dashed #fff;  border-bottom:0px dashed #fff">${b}
<span class="num" style="font-size: 14px;vertical-align: text-top;color:black;font-family: '仿宋'">${++index}</span></span>`
            })
            return {...r,content2}
          })
          return {...item}
        })
        this.$nextTick(() => {
          this.setItemTips()
        })
      },
      setItemTips() {
        let s = window.document.getElementsByClassName('error');
        this.mapPOP = []
        this.mapSX = []
        if (s.length === 0) {
          return
        }
        [...s].forEach((item, index) => {
          let data = {
            index: item.getAttribute('data-index'),
            val: item.getAttribute('data-val'),
            value: '',
            x: item.offsetLeft,
            y: item.offsetTop,
            height: item.offsetHeight,
            width: item.offsetWidth,
            color: this.color[index % this.color.length]
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
            return {
              width: 30,
              left: 10,
              top: top,
              height: height,
              is,
              color: this.color[index % this.color.length]
            }
          })
        })
      },
      download() {
        this.visible = false
        this.downloadCommon('.docx')
      },
      downloadWord() {
        this.visible = false
        this.visiblePZ = false
        this.downloadCommon('.docx')
      },
      downloadPDF() {
        this.visible = false
        this.visiblePZ = false
        this.downloadCommon('.pdf')
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
    display: flex;
    flex-direction: column;
    background: #ffffff;
    padding: 0 20px 20px 20px;
    min-width: 1080px;
    /*height: 100%;*/
    .filter-container {
      position: fixed;
      background: #fff;
      width: 100%;
      z-index: 100;
    }
    .content {
      /*overflow-y: scroll;*/
      /*overflow-x: hidden;*/
      /*flex: 1 1 auto;*/
      margin-top: 53px;
      display: flex;
      position: relative;
      .left {
        width: 765px;
        position: relative;
        border: 1px solid gainsboro;
        padding: 50px 75px 20px 75px;
        .three {
          position: absolute;
          top: 75px;
          font-size: 22px;
          font-family: '黑体';
          input {
            height: 15px;
            font-size: 12px;
            border: none;
          }
        }
        .map-box {
          position: absolute;
          overflow: auto;
          height: 1px;
        }
        .btn-box {
          position: absolute;
          width: 25px;
          height: 25px;
          border: 1px solid gainsboro;
        }
        .top-left {
          left: 45px;
          border-left: none;
          border-top: none;
        }
        .top-right {
          right: 45px;
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
          background: #efdbdc;
          width: 250px;
          padding: 3px;
          border-radius: 8px;
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
        min-width: 100px;
        position: fixed;
        top: 50px;
        z-index: 100;
        right: 15px;
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
