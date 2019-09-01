<template>
    <div class="components-container-editor" ref="container">
        <div class="content">
            <div class="left">
                <div class="btn-box top-left"></div>
                <div class="btn-box top-right"></div>
                <div class="btn-box bottom-left"></div>
                <div class="btn-box bottom-right"></div>
                <div v-for="(item,index) in mapPOP" :key="index" :style="{
                left:item.x+item.width/2+'px',
                top:item.y+item.height+'px',
                right:'-11px'}" class="map-box">
                </div>
                <!--<div class="editor-content" v-html="content"/>-->
                <div v-for="(item,index) in list" :key="'box'+index">
                    <Box :item="item"></Box>
                </div>
            </div>
            <div class="middle">
                <div v-for="(item,index) in mapSX" :key="'sx'+ index" :class="item.is ? 'sx1' : 'sx2'" :style="{
                left:item.left+'px',
                width:item.width+'px',
                height:item.height+'px',
                top:item.top+'px',
                position:'absolute'
              }">

                </div>
                <div v-for="(item,index) in mapPOP" ref="pop" :key="'tip'+index" :style="{
                left:'40px',
                // top:item.y+item.height+'px',
                position:'relative',
                marginBottom:'5px',
                right:0}">
                   <div
                   style="
                   /*position: absolute;*/
                        background: #fff;
                        width: 250px;
                        padding: 3px;
                        border-radius: 4px;
                        border: 1px solid gold;
                        color: gainsboro;
                        line-height: 1.4;
                        font-size: 12px;">
                       <div class="tips"></div>
                        <div style="line-height: 20px">
                            <span>选择以下词修正：</span>
                         <span v-for="i in 4" class="ciku" @click="item.value = '提示'+ i ">
                           {{"提示"+i+','}}
                        </span>
                            <span>手动输入正确词:</span>
                        </div>
                       <el-input v-model="item.value" placeholder="请输入正确词" size="mini" clearable @keyup.enter.native=""style="margin-bottom: 5px" />
                       <div style="text-align: right; margin: 0">
                           <el-button size="mini" type="danger" @click="">忽略</el-button>
                           <el-button size="mini" type="primary"  @click="">确定</el-button>
                       </div>
                   </div>
                </div>
            </div>
            <div class="right">
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
                                <el-button size="mini" type="danger" @click.stop="downloadWord">Word版</el-button>
                                <el-button size="mini" type="danger" @click.stop="downloadPDF">PDF版</el-button>
                            </div>
                            <el-button type="danger" size="mini" slot="reference" @click.stop>正式版</el-button>
                        </el-popover>
                        <el-button size="mini" type="danger" @click.stop="download">批注版</el-button>
                    </div>
                    <el-button type="danger" size="mini" slot="reference" @click.stop>导出公文</el-button>
                </el-popover>
            </div>
        </div>
        <Tooltip v-if="item.show" :left="item.left" :top="item.top" @canel="canel" @sure="sure"></Tooltip>
    </div>
</template>

<script>
    import {getByPath, getsuggestWord, wordformat, getmistakewordHtml,reviseToWord,getByWord} from '@/api/fileupload'
    import Tooltip from './tooltip'
    import Box from './box'

    export default {
        name: 'TinymceDemo',
        components: {Tooltip,Box},
        data() {
            return {
                visible: false,
                visiblePZ: false,
                content: '',
                list: [],
                mapPOP:[],
                mapSX:[],
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
                getByWord({filepath: this.$route.query.path}).then(res=>{
                    this.list = res.word.map((item)=>{
                        let content = item.content.replace(/---@([^@#]+)#---/gm, (a, b) => {
                            return `<span class="error">${b}</span>`
                        });
                        return {...item,content}
                    });
                    this.$nextTick(() => {
                        this.setItemTips()
                    })
                }).catch(res => {
                    this.$message.error('获取失败')
                });
                // getmistakewordHtml({filepath: this.$route.query.path}).then(res => {
                //     this.content = res.wordHtml.replace(/###([^#]+)@@@/gm, (a, b) => {
                //         let data = JSON.parse(b.replace(/&quot;/g, '"'));
                //         this.list.push(data);
                //         return `<span class="th" id="${data.id}" style="text-decoration:line-through;cursor: pointer">${data.mistake}</span>`
                //     });
                //     this.$nextTick(() => {
                //         this.setItemTips()
                //     })
                // }).catch(res => {
                //     this.$message.error('获取失败')
                // });
            },
            setItemTips() {
                let s = window.document.getElementsByClassName('error');
                this.mapPOP = [];
                [...s].forEach(item=>{
                    let data = {value:'',x:item.offsetLeft,y:item.offsetTop ,height:item.offsetHeight,width:item.offsetWidth}
                    if(this.mapPOP.find(r=>{return data.y == r.y})){
                        data.y = data.y + 2;
                    }
                    this.mapPOP.push(data)
                });
                this.$nextTick(() => {
                    console.log(this.mapPOP);
                    this.mapSX = [...this.$refs.pop].map((item,index)=>{
                        let pop = this.mapPOP[index].y + this.mapPOP[index].height;
                        let sx = item.offsetTop+item.offsetHeight/2
                        let is = pop > sx;
                        let height = is ? pop-sx: sx - pop;
                        let top = is ? sx : pop;
                        return {width:30,left:10, top:top+4,height:height,is}
                    })
                    console.log(this.mapSX)
                })
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
        min-width: 1080px;
        .content{
            display: flex;
            position: relative;
            .left{
                width: 635px;
                position: relative;
                border: 1px solid gainsboro;
                padding: 20px  20px 60px 20px;
                .map-box{
                    position: absolute;
                    overflow: auto;
                    height: 4px;
                    border-left: 1px solid gold;
                    border-bottom: 1px solid gold;
                }
                .btn-box{
                    position: absolute;
                    width: 25px;
                    height: 25px;
                    border: 1px solid gainsboro;
                }
                .top-left{
                    border-left: none;
                    border-top: none;
                }
                .top-right{
                    right: 20px;
                    border-right: none;
                    border-top: none;
                }
                .bottom-left{
                    bottom: 20px;
                    border-bottom: none;
                    border-left: none;
                }
                .bottom-right{
                    bottom: 20px;
                    right: 20px;
                    border-bottom: none;
                    border-right: none;
                }
            }
            .middle{
                width: 300px;
                position: relative;
                .sx1{
                    border-left: 1px solid gold;
                    border-top: 1px solid gold;
                }
                .sx2{
                    border-left: 1px solid gold;
                    border-bottom: 1px solid gold;
                }
                .ciku{
                    cursor: pointer;
                    color: black;
                    &:hover{
                        color: #66b1ff;
                    }
                }
                .tips{
                    bottom: -6px;
                    margin-right: 3px;
                    border-top-color: #ebeef5;
                    border-bottom-width: 0;
                    &:after{
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
                .map-box{
                    position: absolute;
                    height: 1px;
                    background: gold;
                }
            }
            .right{
                position: absolute;
                right: 0;
                min-width: 100px;
            }
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
