<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <el-button type="danger" size="small" icon="el-icon-download">
        <a href="../../assets/gwcjzt.zip">公文字体包下载</a>
      </el-button>
    </div>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>一、公文字体包，包含以下字体</span>
      </div>
      <div class="item-detail" v-for="(item,index) in one">
        <el-badge is-dot /> {{item}}
      </div>
    </el-card>
    <el-card shadow="hover" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span>二、公文字体安装提示（仅限Windows操作系统）</span>
      </div>
      <div class="item-detail" v-for="(item,index) in two">
        {{item}}
      </div>
    </el-card>
  </div>
</template>

<script>
  import { exportsystem } from '@/api/fileupload'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'index',
    components: { Pagination },
    data() {
      return {
        list: [],
        dict: {
          user: [],
        },
        one:['方正小标宋简体（1份）。','方正仿宋简体（1份）。','方正仿宋_GBK（1份）。',
          '仿宋_GB2312（1份）。','Times New Roman（1份）。','方正黑体_GBK（1份）。',
          '方正楷体_GBK（1份）。','方正小标宋_GBK（1份）。'],
        two:['第1步：下载“公文字体包”，解压到电脑桌面。',
          '第2步：双击每个字体安装文件，点击“安装”按钮。',
          '第3步：如安装过程提示“已安装该字体”，可“取消”安装。',
          '第4步：字体安装完成后，建议重启电脑或浏览器再使用本系统。'],
        listQuery: {},
        paging:{
          total:0,
          start:1,
          pagesize:10,
        },
      }
    },
    methods: {
      getList() {
        exportsystem().then(res=>{
          this.$message.success('操作成功');
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  .item-detail{
      padding: 5px;
    color: #606266;
    font-size: 14px;
  }
  /deep/.el-badge__content{
    top: -3px;
  }
</style>
