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
        @change="setFont"
        style="margin-left: 10px;width: 130px"
      >
        <el-option v-for="item in fontFamilys" :key="item" :value="item" :label="item"/>
      </el-select>
      <el-input
        style="width: 100px"
        placeholder="份号"
        @blur="oneBlur"
        :maxlength="6"
        ref="threeOne"
        size="small"
        clearable
        v-model="three.one">
      </el-input>
      <el-select
        v-model="three.fou"
        size="small"
        placeholder="密级"
        clearable
        style="width: 80px"
      >
        <el-option v-for="item in threefou" :key="item" :value="item" :label="item"/>
      </el-select>
      <el-input placeholder="时长" clearable size="small" v-model="three.fiv" style="width: 80px">
      </el-input>
      <el-select
        v-model="three.six"
        size="small"
        placeholder="单位"
        clearable
        style="width: 80px"
      >
        <el-option v-for="item in threefiv" :key="item" :value="item" :label="item"/>
      </el-select>
      <el-select
        v-model="three.thr"
        size="small"
        placeholder="紧急程度"
        clearable
        style="width: 100px"
      >
        <el-option v-for="item in threethr" :key="item" :value="item" :label="item"/>
      </el-select>
      <el-select
        v-model="output"
        size="small"
        @change="formatHan"
        placeholder="转为函格式"
        :disabled="outputdisabled"
        style="width: 140px"
      >
        <el-option v-for="item in outputs" :key="item.value" :value="item.value" :label="item.name"/>
      </el-select>
      <el-select
        v-model="type0"
        size="small"
        @change="format"
        placeholder="公文格式"
        style="width: 100px"
      >
        <el-option v-for="item in type0s" :key="item.value" :value="item.value" :label="item.name"/>
      </el-select>
      <el-button style="margin-bottom: 5px" size="small" type="danger" @click.stop="createPicture">导出批注版
      </el-button>
      <el-button style="width: 92px;text-align: center" size="small" type="danger"
                 @click.stop="save"> {{'保 存 公 文'}}
      </el-button>
    </div>
    <div class="content" id="content">
      <div class="left" v-show="list.length > 0">
        <div class="btn-box top-left"></div>
        <div class="btn-box top-right"></div>
        <!--                错别字直线-->
        <div v-if="visiblePreview" v-for="(item,index) in mapPOP" :key="_uuid()" class="map-box"
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
          <Box :item="item" :list="list" :output="output" :type0="type0" :outputdisabled="outputdisabled"></Box>
        </div>
      </div>
      <div class="middle">
        <!--                连接折线-->
        <div v-if="visiblePreview" v-for="(item,index) in mapSX" :key="_uuid()"
             :class="item.is ? 'sx1' : 'sx2'" :style="{
                    borderRight:'0px dashed #fff',
                    borderTop: `1px dashed ${item.is?'#b4373b':'#fff'}`,
                    borderBottom: `1px dashed ${item.is?'#fff':'#b4373b'}`,
                    borderLeft: `1px dashed ${'#b4373b'}`,
                    left:item.left+'px',
                    width:item.width+'px',
                    // transform-origin: x-axis y-axis z-axis;
                    // transform: rotate(45deg);
                    height:item.height+'px',
                    top:item.top+'px',
                    position:'absolute'}">
        </div>
        <!--                错别字修正框-->
        <div v-if="visiblePreview" v-for="(item,index) in mapPOP" ref="pop" :key="'mapPOP'+index" :style="{
                left:'40px',
                position:'relative',
                marginBottom:'5px',
                right:0}">
          <div class="cuobiezi" :style="{border:`1px solid #ff2b3f`}">
            <div>
              <div style="font-weight: 500;margin-bottom: 5px">批注[{{item.index}}]：{{item.val}}</div>
              <div style="margin-bottom: 5px"><span>选择正确词：</span>
                <span style="color: #ff2b3f;margin-right: 5px"
                      v-for="(i,index) in errorList[item.val].coorectname.split(',')" class="ciku"
                      @click="item.value = i" :key="index">{{i}}</span></div>
              <div style="margin-bottom: 5px"><span>输入正确词：</span><input v-model="item.value"
                                                                        style="border:none;border-bottom:1px solid;background: #ffdbdd;width: 160px"
                                                                        type="text"></div>
            </div>
            <div style="text-align: right; margin: 0;font-size: 13px;">
              <span @click="sure(item.index,item.val)" style="cursor: pointer;margin-right: 8px">[<span
                style="font-size: 12px">忽略</span>]
              </span>
              <span @click="()=>item.value&&sure(item.index,item.value)" :style="{cursor:!item.value?'not-allowed':'pointer',color:!item.value?'#9b9b9b':''}">[<span
                style="font-size: 12px">确定</span>]
              </span>
            </div>
          </div>
        </div>
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
  import jsPDF from 'jspdf'
  import {Loading} from 'element-ui'
  import { parseTime } from '@/utils'

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
          six: ''
        },
        threethr: ['特急', '加急', '平急'],
        threefou: ['绝密', '机密', '秘密'],
        threefiv: ['年', '月'],
        fontFamilys: ['方正仿宋简体', '方正仿宋_GBK', '仿宋_GB2312'],
        fontFamily: '',
        outputs: [{name: '文件式公文格式', value: 2}, {name: '信函式公文格式', value: 1}],
        output: '',
        outputdisabled: false,
        type0: '',
        type0s:[{name: '党委', value: 2}, {name: '政府', value: 1}],
        isDisabled: 0
      }
    },
    mounted() {
      this.getDetail()
    },
    watch: {
      'three.fou'() {
        if(!this.three.one){
          this.$message.error('涉密文件，请输入份号');
          this.$nextTick(()=>{
            this.$refs.threeOne.focus();
          })
        }
        this.threeAfter();
      },
      'three.fiv'() {
        this.threeAfter();
      },
      'three.six'() {
        this.threeAfter();
      },
      'three.one'() {
        this.setOldList()
      },
      'three.two'() {
        this.setOldList()
      },
      'three.thr'() {
        this.setOldList()
      }
    },
    methods: {
      threeAfter() {
        if (this.three.fou) {
          if (this.three.fiv && this.three.six) {
            this.three.two = this.three.fou + '★' + this.three.fiv + this.three.six
          } else {
            this.three.two = this.three.fou
          }
        } else {
          this.three.two = ''
        }
      },
      formatHan(){
        // 保证是正确的顺序
        let oldList = [...this.oldList]
        let fenhao = oldList.find(item => item.type == 'fenhao')
        let miji = oldList.find(item => item.type == 'mijiqixian')
        let jinji = oldList.find(item => item.type == 'jinjichengdu')
        let fawen = oldList.find(item => item.type == 'fawenjiguan')
        let biaoti = oldList.find(item => item.type == 'biaoti')
        oldList = oldList.slice(Number(!!fenhao)+Number(!!miji)+Number(!!jinji)+Number(!!fawen)+Number(!!biaoti));
        if(this.output == 1){//信函，密级这些在标题和发文机关下面
          jinji&&oldList.unshift(jinji);
          miji&&oldList.unshift(miji);
          fenhao&&oldList.unshift(fenhao);
          fawen&&oldList.unshift(fawen);
          biaoti&&oldList.unshift(biaoti);
        }else{
          fawen&&oldList.unshift(fawen);
          biaoti&&oldList.unshift(biaoti);
          jinji&&oldList.unshift(jinji);
          miji&&oldList.unshift(miji);
          fenhao&&oldList.unshift(fenhao);
        }
        this.oldList = oldList;
        this.setOldList();
      },
      format(){
        this.setList();
      },
      setFont() {
        this.oldList = this.oldList.map(item => ({
          ...item,
          items: item.items.map(r => ({
            ...r,
            wordStyle: {
              ...r.wordStyle,
              fontFamily: this.sendObj.styleChangeItems.includes(item.type)&& this.fontFamily ? this.fontFamily : r.wordStyle.fontFamily
            }
          }))
        }))
        this.setList()
      },
      setOldList() {
        // 保证是正确的顺序
        let fenhao = this.oldList.find(item => item.type == 'fenhao')
        let miji = this.oldList.find(item => item.type == 'mijiqixian')
        let jinji = this.oldList.find(item => item.type == 'jinjichengdu')
        let [findIndex0,findIndex1,findIndex2] = [this.oldList.findIndex(item => item.type == 'fenhao'),this.oldList.findIndex(item => item.type == 'mijiqixian'),
          this.oldList.findIndex(item => item.type == 'jinjichengdu')].sort();
        fenhao&&(this.oldList[findIndex0] = fenhao)
        miji&&(this.oldList[findIndex1] = miji)
        jinji&&(this.oldList[findIndex2] = jinji)
        if (this.three.one && this.three.two && this.three.thr || !this.three.one && !this.three.two && !this.three.thr) {
          //份号false  密级期限false  紧急程度false  都没有也不渲染
          //份号true  密级期限true  紧急程度true   列表顺序恢复
          let two = this.three.two;
          let thr = this.three.thr;
          if(this.three.two.length === 2&&this.three.thr.length === 2){
            two = this.three.two.replace(/(.{1})/, '$1&nbsp&nbsp&nbsp&nbsp')
            thr = this.three.thr.replace(/(.{1})/, '$1&nbsp&nbsp&nbsp&nbsp')
          }
          this.oldList = this.oldList.map(item => ({
            ...item,
            items: item.items.map(r => ({
              ...r,
              content1: item.type == 'fenhao' ? this.three.one : (item.type == 'mijiqixian' ? two : (item.type == 'jinjichengdu' ? thr : r.content1))
            }))
          }))
        } else if (this.three.one && this.three.two && !this.three.thr) {//份号true  密级期限true  紧急程度false  列表顺序恢复  替换密级期限
          let val = this.three.two.length === 2 ? this.three.two.replace(/(.{1})/, '$1&nbsp&nbsp&nbsp&nbsp') : this.three.two
          this.oldList = this.oldList.map(item => ({
            ...item,
            items: item.items.map(r => ({
              ...r,
              content1: item.type == 'fenhao' ? this.three.one : (item.type == 'mijiqixian' ? val : (item.type == 'jinjichengdu' ? this.three.thr : r.content1))
            }))
          }))
        } else if (this.three.one && !this.three.two && this.three.thr) {//份号true  密级期限false  紧急程度true
          let val = this.three.thr.length === 2 ? this.three.thr.replace(/(.{1})/, '$1&nbsp&nbsp&nbsp&nbsp') : this.three.thr
          this.oldList[findIndex1] = jinji
          this.oldList[findIndex2] = miji
          this.oldList = this.oldList.map(item => ({
            ...item,
            items: item.items.map(r => ({
              ...r,
              content1: item.type == 'fenhao' ? this.three.one : (item.type == 'mijiqixian' ? this.three.two : (item.type == 'jinjichengdu' ? val : r.content1))
            }))
          }))
        } else if (!this.three.one && !this.three.two && this.three.thr) {//份号false  密级期限false  紧急程度true
          let val = this.three.thr.length === 2 ? this.three.thr.replace(/(.{1})/, '$1&nbsp&nbsp&nbsp&nbsp') : this.three.thr
          this.oldList[findIndex0] = jinji
          this.oldList[findIndex2] = fenhao
          this.oldList = this.oldList.map(item => ({
            ...item,
            items: item.items.map(r => ({
              ...r,
              content1: item.type == 'fenhao' ? this.three.one : (item.type == 'mijiqixian' ? this.three.two : (item.type == 'jinjichengdu' ? val : r.content1))
            }))
          }))
        } else if (this.three.one && !this.three.two && !this.three.thr) {//份号true  密级期限false  紧急程度false  列表顺序恢复
          this.oldList = this.oldList.map(item => ({
            ...item,
            items: item.items.map(r => ({
              ...r,
              content1: item.type == 'fenhao' ? this.three.one : (item.type == 'mijiqixian' ? this.three.two : (item.type == 'jinjichengdu' ? this.three.thr : r.content1))
            }))
          }))
        } else if (!this.three.one && this.three.two && this.three.thr || !this.three.one && this.three.two && !this.three.thr) {
          //份号false  密级期限true  紧急程度true  业务上没这种情况
          //份号false  密级期限true  紧急程度false 业务上没这种情况
          this.oldList = this.oldList.map(item => ({
            ...item,
            items: item.items.map(r => ({
              ...r,
              content1: item.type == 'fenhao' ? '' : (item.type == 'mijiqixian' ? '' : (item.type == 'jinjichengdu' ? '' : r.content1))
            }))
          }))
        }
        this.setList()
      },
      oneBlur() {
        this.three.one = this.three.one && (Array(6).join('0') + this.three.one).slice(-6)
      },
      createPicture() {
        let dom = document.getElementById('content');
        let loadingInstance = Loading.service({
          text: '正在导出，请勿操作',
          background: 'rgba(0, 0, 0, 0.28)',
          spinner: 'el-icon-loading'
        })
        html2canvas(dom, {
          imageTimeout: 10000,
          onclone:(el)=>{
            el.getElementsByClassName('main-container')[0].style.transition = 'none';
          },
        }).then(canvas => {
          let imgData = canvas.toDataURL('image/jpeg')
          let img = new Image()
          img.src = imgData
          let name = this.$route.query.name
          //根据图片的尺寸设置pdf的规格，要在图片加载成功时执行，之所以要*0.5是因为比例问题
          img.onload = function () {
            //此处需要注意，pdf横置和竖置两个属性，需要根据宽高的比例来调整，不然会出现显示不完全的问题
            let doc = ''
            if (this.width > this.height) {
              doc = new jsPDF('l', 'mm', [this.width * 0.5, this.height * 0.5])
            } else {
              doc = new jsPDF('p', 'mm', [this.width * 0.5, this.height * 0.5])
            }
            doc.addImage(imgData, 'jpeg', 0, 0, this.width * 0.175, this.height * 0.175)  //比例可根据需要调节
            //根据下载保存成不同的文件名
            // doc.save('（批注版）_'+parseTime(new Date(),'{y}-{m}-{d}')+'_' +name.split('/').reverse()[0] + '.pdf')
            doc.save('（批注版）_'+name + '.pdf')
            loadingInstance.close()
          }
        })
      },
      save() {
        let list = [...this.list]
        let fenhao = list.find(item => item.type == 'fenhao')
        let miji = list.find(item => item.type == 'mijiqixian')
        let jinji = list.find(item => item.type == 'jinjichengdu')
        let fawen = list.find(item => item.type == 'fawenjiguan')
        let biaoti = list.find(item => item.type == 'biaoti')
        list = list.slice(Number(!!fenhao)+Number(!!miji)+Number(!!jinji)+Number(!!fawen)+Number(!!biaoti));
        if(this.output == 1){//信函，密级这些在标题和发文机关下面
          jinji&&list.unshift(jinji);
          miji&&list.unshift(miji);
          fawen&&list.unshift(fawen);
          fenhao&&list.unshift(fenhao);
          biaoti&&list.unshift(biaoti);
        }else{
          fawen&&list.unshift(fawen);
          biaoti&&list.unshift(biaoti);
          jinji&&list.unshift(jinji);
          miji&&list.unshift(miji);
          fenhao&&list.unshift(fenhao);
        }
        if(miji){
          let mijiContent = miji.items[0].content1.replace(/\s*/g,"");
          miji.items[0].content = mijiContent.replace(/&nbsp&nbsp&nbsp&nbsp/,'');
          miji.items[0].content0 = miji.items[0].content;
          miji.items[0].content1 = miji.items[0].content;
          miji.items[0].content2 = miji.items[0].content;
          miji.items[0].content3 = miji.items[0].content;
        }
        if(jinji){
          let jinjiContent = jinji.items[0].content1.replace(/\s*/g,"");
          jinji.items[0].content = jinjiContent.replace(/&nbsp&nbsp&nbsp&nbsp/,'');
          jinji.items[0].content0 = jinji.items[0].content;
          jinji.items[0].content1 = jinji.items[0].content;
          jinji.items[0].content2 = jinji.items[0].content;
          jinji.items[0].content3 = jinji.items[0].content;
        }
        saveWord({
          ...this.sendObj,
          type: this.output == 1 ? '函' : this.sendObj.type,
          type0:this.type0,
          list: list.map((item) => ({
            ...item,
            items: item.items&&item.items.map(r => ({
              ...r,
              content0: r.content3,
              content2: undefined,
              content3: undefined
            }))
          }))
        }).then(res => {
          this.$message.success('保存成功')
          this.$router.go(-1)
        })
      },
      getDetail() {
        if (!this.$route.query.path) {
          this.$router.go(-1)
          return
        }
        getByWord({filepath: this.$route.query.path,id:this.$route.query.id}).then(res => {
          this.sendObj = res.word
          this.errorList = res.word.wordMap;
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
          this.oldList = [...list];
          if(fenhao&&miji&&jinji){
            this.three.one = fenhao.items[0].content;
            this.three.thr = jinji.items[0].content.replace(/\s*/g,"");
            let content = miji.items[0].content;
            if(content.length>=5){
              let index = content.split('★');
              let after = index[1].split('');
              this.three.fou = index[0];
              this.three.six = after.pop();
              this.three.fiv = after.join('');
            }else {
              this.three.fou = miji.items[0].content.replace(/\s*/g,"");
            }
          }
          this.setList()
        })
      },
      sure(index, valvue) {
        this.replace.push({index, valvue})
        this.setList()
      },
      setList() {
        this.list = []
        this.isDisabled += 1
        let index = 0
        let indexCopy = 0
        this.list = this.oldList.map((item) => {
          item.items = item.items.map(r => {
            let content2 = r.content1.replace(/---@([^@#]+)#---/gm, (a, b) => {
              let replace = this.replace.find(n => n.index - 1 == index)
              if (replace) {
                index++
                return replace.valvue
              }
              return `<span class="error" data-index="${++index}" data-val="${b}" style="background:#ffdbdd;border:1px solid #ff2b3f;border-top:0px dashed #fff;border-bottom:0px dashed #fff">${b}
<span class="num" style="font-size:14px;line-height:14px;vertical-align:text-top;color:black;font-family:'仿宋'">${index}</span></span>`
            })
            console.log('content2',content2)
            let content3 = r.content1.replace(/---@([^@#]+)#---/gm, (a, b) => {
              let replace = this.replace.find(n => n.index - 1 == indexCopy)
              indexCopy++
              if (replace) {
                return replace.valvue
              }
              return `${b}`
            })
            console.log('content3',content3)
            return {...r, content2, content3}
          })
          return {...item}
        })
        this.$nextTick(() => {
          this.setItemTips()
        })
      },
      setItemTips() {
        let s = window.document.getElementsByClassName('error')
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
          // if (this.mapPOP.find(r => {
          //   return data.y == r.y
          // })) {
          //   data.y = data.y + 1
          // }
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
    .content {
      width: 1100px;
    }
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
        width: 772px;
        position: relative;
        border: 1px solid gainsboro;
        padding: 75px 75px 70px 75px;
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
          top: 50px;
          left: 45px;
          border-left: 1px solid #fff;
          border-top: 1px solid #fff;
        }

        .top-right {
          top: 50px;
          right: 45px;
          border-right: 1px solid #fff;
          border-top: 1px solid #fff;
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
          background: #ffdbdd;
          width: 250px;
          padding: 7px;
          border-radius: 8px;
          line-height: 1.4;
          font-size: 12px;
        }

        input[type="text"]:focus {
          outline: none;
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
  }
</style>
