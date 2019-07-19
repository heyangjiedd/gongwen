<template>
  <div class="app-container">
    <el-form ref="form" :model="form" >
      <el-form-item>
        <el-upload
                :limit="1"
                :file-list="fileList"
                action="http://47.108.65.129:8020/v1/file/">
          <el-button size="small" type="primary">上传公文</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList:[],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

