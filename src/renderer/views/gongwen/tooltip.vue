<template>
    <div class="el-popover"  :style="{top:top,left:left}">
        <div class="el-popover__title">提醒</div>
        '列会'应该改成'例会'，是否立即纠正？
        <div class="popper__arrow"></div>
        <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'tooltip',
    props:{
      top: {
        type: String,
        default: '236px'
      },
      left: {
        type: String,
        default: '483px'
      },
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    .el-popover {
        width: 200px;
        position: absolute;
        top: 236px;
        left: 483px;
        transform-origin: center bottom;
        z-index: 2118;
        margin-bottom: 12px;
        padding: 18px 20px;
        background: #fff;
        min-width: 150px;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        color: #606266;
        line-height: 1.4;
        text-align: justify;
        font-size: 14px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        .el-popover__title {
            color: #303133;
            font-size: 16px;
            line-height: 1;
            margin-bottom: 12px;
        }
        .popper__arrow{
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            border-width: 6px;
            filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
            bottom: -6px;
            left: 50%;
            margin-right: 3px;
            border-top-color: #ebeef5;
            border-bottom-width: 0;
            &:after{
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                border-color: transparent;
                border-style: solid;
                content: " ";
                border-width: 6px;
                bottom: 1px;
                margin-left: -6px;
                border-top-color: #fff;
                border-bottom-width: 0;
            }
        }
    }

</style>
