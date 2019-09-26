<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="listQuery"
        style="margin-bottom: -18px;">
        <el-row>
          <el-form-item label="关键字：" label-width="100px">
            <el-input v-model="listQuery.Searchkey" placeholder="请输入" clearable
                      @keyup.enter.native="getList"/>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" icon="el-icon-search" @click="getList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" icon="el-icon-refresh" @click="handleFilter">刷新</el-button>
          </el-form-item>
        </el-row>
      </el-form>

    </div>

    <el-table
      :data="list"
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" align="center" show-overflow-tooltip width="50px"/>
      <el-table-column label="错词" prop="Name" min-width="60"/>
      <el-table-column label="正确词" prop="CoorectName" min-width="60"/>
      <el-table-column label="标记账号" prop="Uname" min-width="60"/>
      <el-table-column label="所属单位" prop="Cname" min-width="60"/>
      <el-table-column label="所属类目" prop="Catename" min-width="60"/>
      <el-table-column label="所属词库" prop="Scope" min-width="60">
        <template slot-scope="{row}">
          <el-tag  v-if="row.Scope===1">公共词库</el-tag>
          <el-tag type="warning" v-else>私有词库</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="删除时间" align="Updatetime" min-width="60">
        <template slot-scope="{row}">
          {{row.Updatetime&&row.Updatetime.time | parseTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleDetail(row)">
            恢复
          </el-button>
          <el-button type="danger" size="mini" @click="handleRemove(row)">
            彻底删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :background="false"  v-show="paging.total>0" :total="paging.total" :page.sync="paging.start" :limit.sync="paging.pagesize" @pagination="getList" />
  </div>
</template>

<script>
  import { get, add, update, remove } from '@/api/word'
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
        listQuery: {},
        paging:{
          total:0,
          start:1,
          pagesize:10,
          sort:'Updatetime',
          order:'desc',//asc升序 desc倒序
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      handleDetail(data){
        update({...data,updatetime: undefined,status:1}).then(res=>{
          this.getList();
        })
      },
      getList() {
        get({ ...this.listQuery,...this.paging,Status:-1}).then(res => {
          this.list = res.Data;
          this.paging.total = res.Recordsfiltered;
        })
      },
      handleFilter() {
        this.listQuery = {}
        this.getList()
      },
      handleRemove(data) {
        this.$confirm('确认删除该条数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: (res) => {
            if (res == 'confirm') {
              remove(data.Id).then(() => {
                this.$message.success('操作成功')
                this.getList()
              })
            }
          }
        })

      },
    }
  }
</script>
