<template>
    <div class="app-container">
        <el-upload
                :limit="1"
                :file-list="fileList"
                name="files"
                :on-success="success"
                action="http://47.108.65.129:8020/v1/upload/">
            <el-button size="small" type="primary">上传公文</el-button>
        </el-upload>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        data() {
            return {
                fileList: [],
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
            success(data){
                this.$message.success(data.msg)
            },
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
    .line {
        text-align: center;
    }
</style>

