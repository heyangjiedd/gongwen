<template>
    <div class="components-container-editor" ref="container">
        <el-row>
            <el-col :span="22">
                <div class="editor-content" v-html="content"/>
            </el-col>
            <el-col :span="2" style="padding-left: 10px">
                <el-button style="margin-bottom: 10px" size="small" type="danger" @click.stop="$router.go(-1)">返回首页
                </el-button>
                <!--<br/>-->
                <!--<el-button style="margin-bottom: 10px" size="small" type="danger" @click.stop="visible = false">保存公文-->
                <!--</el-button>-->
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
                                <el-button size="mini" type="danger" @click.stop="downloadWord">Word版</el-button>
                                <el-button size="mini" type="danger" @click.stop="downloadPDF">PDF版</el-button>
                            </div>
                            <el-button type="danger" size="mini" slot="reference" @click.stop>正式版</el-button>
                        </el-popover>
                        <el-button size="mini" type="danger" @click.stop="download">批注版</el-button>
                    </div>
                    <el-button type="danger" size="mini" slot="reference" @click.stop>导出公文</el-button>
                </el-popover>
            </el-col>
        </el-row>
        <Tooltip v-if="item.show" :left="item.left" :top="item.top" @canel="canel" @sure="sure"></Tooltip>
    </div>
</template>

<script>
    import {getByPath, getsuggestWord, wordformat, getmistakewordHtml,reviseToWord} from '@/api/fileupload'
    import Tooltip from './tooltip'

    export default {
        name: 'TinymceDemo',
        components: {Tooltip},
        data() {
            return {
                visible: false,
                visiblePZ: false,
                content: '',
                list: [],
                item: {show: false, left: 0, top: 0,id:null}
            }
        },
        mounted() {
            this.getDetail();
            // wordformat({filepath:this.$route.query.path+'_jy.docx',layout:'html'}).then(res => {
            //     this.content = res.wordHtml
            // }).catch(res=>{
            //     this.$router.go(-1)
            // });
        },
        methods: {
            getDetail(){
                this.list = [];
                getmistakewordHtml({filepath: this.$route.query.path}).then(res => {
                    this.content = res.wordHtml.replace(/###([^#]+)@@@/gm, (a, b) => {
                        let data = JSON.parse(b.replace(/&quot;/g, '"'));
                        this.list.push(data);
                        return `<span class="th" id="${data.id}" style="text-decoration:line-through;cursor: pointer">${data.mistake}</span>`
                    });
                    this.$nextTick(() => {
                        this.setItemTips()
                    })
                }).catch(res => {
                    this.$message.error('获取失败')
                });
            },
            showToop(item) {
                this.item = {
                    left: item.offsetLeft+30+ 'px',
                    top: item.offsetTop + 'px',
                    id:item.id,
                    show:true,
                }
            },
            sure(revise) {
                let data = this.list.find(item => item.id == this.item.id);
                reviseToWord({paramlist:[{...data,revise}], pzname:this.$route.query.path}).then(res=>{
                    this.$message.success('修改成功')
                    this.getDetail();
                    this.canel();
                })
            },
            canel(){
                this.item.show = false;
            },
            setItemTips() {
                let s = window.document.getElementsByClassName('th');
                [...s].forEach(item => {
                    item.onclick = () => this.showToop(item);
                })
            },
            download() {
                this.visible = false;
                this.downloadCommon('.docx')
            },
            downloadWord() {
                this.visible = false;
                this.visiblePZ = false;
                this.downloadCommon('_zs.docx')
            },
            downloadPDF() {
                this.visible = false;
                this.visiblePZ = false;
                this.downloadCommon('_zs.pdf')
            },
            downloadCommon(url) {
                const ele = document.createElement('a');
                ele.setAttribute('href', `${this.baseUrl}doc/${this.$route.query.path}${url}`); //设置下载文件的url地址
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
