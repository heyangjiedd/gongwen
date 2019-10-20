<template>
  <div class="app-container">
    <div class="filter-container">
    </div>

    <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="旧密码" prop="oldpassword">
            <el-input size="small" placeholder="请输入旧密码" v-model="form.oldpassword" clearable>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="新密码" prop="newpassword">
            <el-input size="small" placeholder="请输入新密码" type="password" v-model="form.newpassword" clearable>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="confirmpassword">
            <el-input size="small" @keyup.enter.native="sure" placeholder="请输入确认密码" type="password" v-model="form.confirmpassword" clearable>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-button size="small" type="danger" @click="sure">确定</el-button>
  </div>
</template>

<script>
  import { changepassword } from '@/api/user'

  export default {
    name: 'index',
    data() {
      let validatePass = (rule, value, callback) => {
        if (this.form.oldpassword === this.form.newpassword) {
          callback(new Error('不能与原密码一致'));
        } else {
          callback();
        }
      };
      let validatePass1 = (rule, value, callback) => {
        if (this.form.confirmpassword !== this.form.newpassword) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      return {
        form: {},
        rules: {
          oldpassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
          newpassword: [{ required: true, message: '请输入新密码', trigger: 'blur' },
              { min: 6,message: '至少填写6位密码', trigger: 'blur' },{
            validator: validatePass, trigger: 'blur'
          }],
          confirmpassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' },
              { min: 6,message: '至少填写6位密码', trigger: 'blur' },{
            validator: validatePass1, trigger: 'blur'
          }]
        }
      }
    },
    created() {

    },
    methods: {
      sure() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            changepassword({ ...this.form }).then(res => {
              this.form = {}
              this.$message.success({
                message:'操作成功',
                onClose: async ()=>{
                  await this.$store.dispatch('user/logout')
                  this.$router.push(`/login?redirect=${this.$route.fullPath}`)
                }
              })
            })
          }
        })
      }
    }
  }
</script>
