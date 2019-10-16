<template>
  <div class="components-container-detail" ref="container">
    <div class="content">
      <div class="left" v-show="list.length > 0">
        <div class="btn-box top-left"></div>
        <div class="btn-box top-right"></div>
        <!--                文本段落-->
        <div v-for="(item,index) in list" :key="'box'+index">
          <Box :item="item" :list="list"  :output="output" :type0="type0" :outputdisabled="outputdisabled"></Box>
        </div>
      </div>
      <div class="right">
        <el-button style="margin-bottom: 10px" size="small" type="danger" @click.stop="$router.go(-1)">返回首页
        </el-button>
        <br/>
        <el-popover
          width="200"
          v-model="visible">
          <p>请选择您要导出的版本</p>
          <div style="text-align: right; margin: 0">
            <!--<el-popover-->
            <!--width="200"-->
            <!--v-model="visiblePZ">-->
            <!--<p>请选择您要导出的公文版本</p>-->
            <!--<div style="text-align: right; margin: 0">-->
            <!--<el-button size="mini" type="danger" @click.stop="downloadWord">Word版</el-button>-->
            <!--<el-button size="mini" type="danger" @click.stop="downloadPDF">PDF版</el-button>-->
            <!--</div>-->
            <!--<el-button type="danger" size="mini" slot="reference" @click.stop>正式版</el-button>-->
            <!--</el-popover>-->
            <el-button size="mini" type="danger" @click.stop="downloadPDF('docx')">Word版</el-button>
            <el-button size="mini" type="danger" @click.stop="downloadPDF('pdf')">PDF版</el-button>
          </div>
          <el-button type="danger" size="mini" slot="reference" @click.stop>导出公文</el-button>
        </el-popover>
        <br/>
        <el-button style="margin-top: 10px" size="mini" type="primary" @click.stop="handleEdit">编辑公文
        </el-button>
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
        content: '',
        list: [],//文本板块
        mapPOP: [],//错别字库
        mapSX: [],//连接折线
        item: {show: false, left: 0, top: 0, id: null},
        three: {},
        type0: '',
        output:2,
        outputdisabled:'',
      }
    },
    mounted() {
      this.getDetail()
    },
    methods: {
      handleEdit(){
        this.$router.push({path: '/home/edit', query: this.$route.query})
      },
      getDetail() {
        if (!this.$route.query.path) {
          this.$router.go(-1)
          return
        }
        this.list = []
        getByWord({filepath: this.$route.query.path+this.$route.query.ext,id:this.$route.query.id}).then(res => {
          this.type0 = res.word.type0;
          this.output = res.word.type=='函'?1:2;
          this.outputdisabled = res.word.type=='函';
          let list = [...res.word.list]
          // 保证是正确的顺序
          let fenhao = list.find(item => item.type == 'fenhao')
          let miji = list.find(item => item.type == 'mijiqixian')
          let jinji = list.find(item => item.type == 'jinjichengdu')
          let fawen = list.find(item => item.type == 'fawenjiguan')
          let biaoti = list.find(item => item.type == 'biaoti')
          if(this.output == 1){//信函，密级这些在标题和发文机关下面
            list = list.slice(Number(!!fenhao)+Number(!!miji)+Number(!!jinji)+Number(!!fawen)+Number(!!biaoti));
            jinji&&list.unshift(jinji);
            miji&&list.unshift(miji);
            fenhao&&list.unshift(fenhao);
            fawen&&list.unshift(fawen);
            biaoti&&list.unshift(biaoti);
          }
          this.list = list.map((item) => {
            item.items = item.items.map(r => {
              return {...r, content2: r.content}
            })
            return {...item}
          })
        }).catch(res => {
          this.$message.error('获取失败')
        })
      },
      setItemTips() {
        let s = window.document.getElementsByClassName('num')
        this.mapPOP = [];
        [...s].forEach((item, index) => {
          let data = {
            value: '',
            x: item.offsetLeft,
            y: item.offsetTop,
            height: item.offsetHeight,
            width: item.offsetWidth,
            color: this.color[index % this.color.length],
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
              top: top + 5,
              height: height,
              is,
              color: this.color[index % this.color.length],
            }
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
        this.downloadCommon('.docx')
      },
      downloadPDF(layout) {
        this.visible = false
        this.visiblePZ = false
        wordformat({filepath: this.$route.query.path, layout,id: this.$route.query.id}).then(res => {
          const ele = document.createElement('a')
          ele.setAttribute('href', `${this.baseUrl}doc/${res.filepaths[0]}`) //设置下载文件的url地址
          console.log(`${this.baseUrl}doc/${res.filepaths[0]}`)
          ele.setAttribute('target', `_blank`) //设置下载文件的url地址
          ele.click()
        })
      },
      downloadCommon(url) {
        const ele = document.createElement('a')
        ele.setAttribute('href', `${this.baseUrl}doc/${this.$route.query.path}${url||''}`) //设置下载文件的url地址
        console.log(`${this.baseUrl}doc/${this.$route.query.path}${url}`)
        ele.click()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .components-container-detail {
    background: #ffffff;
    padding: 20px;
    min-width: 1080px;

    .content {
      display: flex;
      position: relative;

      .left {
        width: 772px;
        position: relative;
        border: 1px solid gainsboro;
        padding: 75px 75px 70px 75px;
        .three {
          position: absolute;
          top: 75px;
          font-size: 22px;
          font-family: '黑体';
          > div {
            padding: 3px 0;
          }
        }
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
          top:50px;
          left: 45px;
          border-left: none;
          border-top: none;
        }

        .top-right {
          top:50px;
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
        position: fixed;
        right: 25px;
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
