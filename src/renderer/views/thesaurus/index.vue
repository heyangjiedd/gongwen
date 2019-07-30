<template>
    <div class="app-container">
        <el-row>
            <el-button style="float: right;margin-right: 10px" size="small" type="danger">一键导出词库</el-button>
            <el-button style="float: right;margin-right: 10px" size="small" type="danger" @click="handleAdd">新建关键词库</el-button>
            <el-input
                    style="float: right;width: 200px"
                    placeholder="请输入搜索关键字"
                    size="small"
                    v-model="listQuery.keyWords">
                <i slot="suffix" @click="goSearch" class="el-input__icon el-icon-search"></i>
            </el-input>
        </el-row>
        <el-row>
            <el-col  :xs="8" :lg="6" v-for="(item,index) in list" :key="index" class="card-hover">
                <el-card shadow="hover" style="margin: 20px 10px 0 10px " >
                    <div slot="header" @click="goList(item)" class="clearfix">
                        <span class="title-hover">{{item.Name}}</span>
                    </div>
                    <ul style="height: 300px" >
                        <li v-if="item.children&&item.children.length>0" @click="goList(item)" v-for="(r,n) in item.children">
                            {{r.Name}}
                        </li>
                    </ul>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog :title="title" :visible.sync="dialogVisible" @close="()=>restForm('form','form')">
            <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="100px">
                <el-row>
                    <el-col :md="24" :lg="24">
                        <el-form-item label="词库名称" prop="Name">
                            <el-input placeholder="请输入词库名称" v-model="form.Name" clearable>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sure">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {get, add, update, remove} from '@/api/category'
  import {get as wordGet, add as wordAdd , update as wordUpdate , remove as wordRemove} from '@/api/word'
  import Pagination from '@/components/Pagination'

  export default {
    components: { Pagination },
    data() {
      return {
        dialogVisible:false,
        listQuery: {},
        title:'',
        fileList: [],
        form:{},
        list: [],
        rules: {
          Name: [{required: true, message: '请填写词库名称', trigger: 'blur'}],
        }
      }
    },
    created() {
      this.getList()
    },
    mounted() {

    },
    methods: {
      handleAdd() {
        this.form = {...this.form}
        this.dialogVisible = true
        this.title = '词库新增'
      },
      goSearch(){
        this.$router.push({path:'/thesaurus/search',query:{keyWords:this.listQuery.keyWords}})
      },
      goList(item){
        this.$router.push({name:'list',params:{item:{...item}}})
      },
      handleRemove(data) {
        remove(data.Id).then(() => {
          this.$message.success('操作成功')
          this.getList()
        })
      },
      success(data) {
        this.$message.success(data.msg)
      },
      sure() {
        add({...this.form, Scope: 0,}).then(res => {
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.getList()
        })
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      getList() {
        wordGet().then(res=>{
          get({ ...this.paging,Scope: 0}).then(resp => {
            this.list = resp.Data.map(item=>{
                let data = res.Data.filter(r=>r.Cateid == item.Id)
                return {...item,children:data}
            })
            console.log(this.list)
          })
        })
      },
      handleFilter() {
        this.listQuery = {}
        this.getList()
      }
    }
  }
</script>
<style lang="scss" scoped>
    .el-icon-search{
        cursor: pointer;
    }
    .card-hover{
        &:hover{
            cursor: pointer;
            .title-hover{
                color: #c00000;
            }
        }
    }

    .list-item {
        font-size: 12px;
        color: #808080;
    }
</style>

