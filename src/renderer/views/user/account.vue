<template>
  <div class="app-container">
    <div class="filter-container">
    </div>

    <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="旧密码" prop="oldpassword">
            <el-input placeholder="请输入旧密码" v-model="form.oldpassword" clearable>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="新密码" prop="newpassword">
            <el-input placeholder="请输入新密码" type="password" v-model="form.newpassword" clearable>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="confirmpassword">
            <el-input placeholder="请输入确认密码" type="password" v-model="form.confirmpassword" clearable>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="primary" @click="sure">确定</el-button>
  </div>
</template>

<script>
  import {changepassword} from '@/api/user'

  export default {
    name: 'index',
    data() {
      return {
        form: {},
        rules: {
          oldpassword: [{required: true, message: '请输入旧密码', trigger: 'blur'}],
          newpassword: [{required: true, message: '请输入新密码', trigger: 'blur'}],
          confirmpassword: [{required: true, message: '请输入确认密码', trigger: 'blur'}],
        }
      }
    },
    created() {

    },
    methods: {
      sure() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            changepassword({...this.form}).then(res => {
              this.$message.success('操作成功');
              this.form = {}
            })
          }
        })
      },
    }
  }
</script>
