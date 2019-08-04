<template>
    <div class="components-container-editor" ref="container">
        <el-row>
            <el-col :xs="14" :lg="15" :style="{padding:'10px'}">
                <div class="editor-content" v-html="content"/>
            </el-col>
            <el-col :xs="7" :lg="7" :style="{padding:'10px'}">

            </el-col>
            <el-col :xs="3" :lg="2" :style="{padding:'10px'}">
                <el-button style="margin-bottom: 10px" size="small" type="danger" @click.stop="$router.go(-1)">返回首页
                </el-button>
                <br/>
                <el-button style="margin-bottom: 10px" size="small" type="danger" @click.stop="visible = false">保存公文
                </el-button>
                <br/>
                <el-popover
                        width="200"
                        v-model="visible">
                    <p>请选择您要导出的公文版本</p>
                    <div style="text-align: right; margin: 0">
                        <el-popover
                                width="200"
                                v-model="visiblePZ">
                            <p>请选择您要导出的批注公文版本</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="danger" @click.stop="downloadWord" >Word版</el-button>
                                <el-button size="mini" type="danger" @click.stop="downloadPDF">PDF版</el-button>
                            </div>
                            <el-button type="danger" size="mini" slot="reference" @click.stop>正式版</el-button>
                        </el-popover>
                        <el-button size="mini" type="danger"  @click.stop="download">批注版</el-button>
                    </div>
                    <el-button type="danger" size="mini" slot="reference" @click.stop>导出公文</el-button>
                </el-popover>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {getByPath} from '@/api/fileupload'

    export default {
        name: 'TinymceDemo',
        data() {
            return {
                height: 500,
                visible: false,
                visiblePZ: false,
                content:'',
            }
        },
        mounted() {
            this.height = this.$refs.container.clientHeight;
            getByPath({filepath:this.$route.query.path+'.html'}).then(res => {
                this.content = res.wordHtml
            }).catch(res=>{
                this.$router.go(-1)
            })
        },
        methods:{
            download(){
                this.visible = false;
                this.downloadCommon('.docx')
            },
            downloadWord(){
                this.visiblePZ = false;
                this.downloadCommon('.docx')
            },
            downloadPDF(){
                this.visiblePZ = false;
                this.downloadCommon('.pdf')
            },
            downloadCommon(url){
                const ele = document.createElement('a');
                ele.setAttribute('href',`${this.base}doc/${this.$route.query.path}${url}`); //设置下载文件的url地址
                ele.click();
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    .components-container-editor {
        background: #ffffff;
        padding: 20px;
        span {
            /*color:red !important;*/
        }
    }

</style>
