<template>
    <div class="box-man">
        <div v-if="item.typename == 'biaoti'" class="biaoti"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'fawejiguan'" class="fawejiguan"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'biaoti1'" class="biaoti1"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'zhusongjiguan'" class="zhusongjiguan"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'zhengwen'" class="zhengwen"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'shumin'" class="shumin"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'datatime'" class="datatime"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>

        <div v-if="item.typename == 'pagetag'" class="pagetagbefore">
            <div class="pagetagbefore-left"></div>
            <div class="pagetagbefore-right"></div>
        </div>
        <div v-if="item.typename == 'pagetag'" class="pagetag"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>

        <div v-if="item.typename == 'level1'" class="level1"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'level2'" class="level2"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'level3'" class="level3"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'level4'" class="level4"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'fujian'" class="fujian"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'danweimingcheng'" class="danweimingcheng"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'chengwenriqi'" class="chengwenriqi"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'chuxi'" class="chuxi"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'zhengli'" class="zhengli"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
        <div v-if="item.typename == 'banji'" class="banji"
             :style="{fontFamily:item.style.fontFamily,color:item.style.color,fontSize:item.style.fontSize}"
             v-html="item.content"></div>
    </div>
</template>

<script>
    export default {
        name: 'box',
        props: {
            item: {
                type: Object,
                default: () => {
                }
            }
        },
        mounted() {

        },
        methods: {}
    }
</script>
<style scoped lang="scss">

    .box-man {
        .biaoti {
            text-align: center;
            margin: 90px 0 20px 0;
        }

        .fawejiguan {
            text-align: center;
            padding-bottom: 5px;
            border-bottom: 2px solid red;
        }

        .biaoti1 {
            margin: 20px 0 10px 0;
            text-align: center;
        }

        .zhusongjiguan {
            margin: 10px 0 0 0;
        }

        .zhengwen {
            text-indent: 2rem;
            line-height: 2rem;
        }

        .shumin {
            text-align: right;
            margin: 10px 0;
        }

        .datatime {
            text-align: right;
            margin: 10px 0;
        }

        .pagetagbefore {
            position: relative;
            margin-top: 40px;

            div {
                position: absolute;
                width: 25px;
                height: 25px;
                border: 1px solid gainsboro;
            }

            .pagetagbefore-left {
                border-bottom: none;
                border-left: none;
            }

            .pagetagbefore-right {
                right: 20px;
                border-bottom: none;
                border-right: none;
            }
        }

        .pagetag {
            margin-top: 30px;
            float: right;
        }

        .level1 {
            text-indent: 2rem;
            line-height: 2rem;
        }

        .level2 {
            text-indent: 2rem;
            line-height: 2rem;
        }

        .level3 {
            text-indent: 2rem;
            line-height: 2rem;
        }

        .level4 {
        }

        .fujian {
            margin-top: 20px;
        }

        .danweimingcheng {
            text-align: right;
            margin: 10px 0;
        }

        .chengwenriqi {
            text-align: right;
            margin: 10px 0;
        }

        .chuxi {
            text-indent: 2rem;
            line-height: 2rem;
        }
        .zhengli {
            text-indent: 2rem;
            line-height: 2rem;
        }
        .banji{
            margin-top: 100px;
            text-align: center;
            border-bottom: 2px solid;
            border-top: 2px solid;
        }
    }

</style>
