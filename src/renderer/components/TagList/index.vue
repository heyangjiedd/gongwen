<template>
    <div>
        <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                size="small"
                :disable-transitions="false"
                type="danger"
                @close="handleClose(tag)">
            {{tag}}
        </el-tag>
        <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                type="danger"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="mini" @click="showInput" type="danger" icon="el-icon-plus">添加</el-button>
    </div>
</template>

<script>
  export default {
    name: 'index',
    props:{
      value: {
        type: Array,
        default: () => []
      }
    },
    watch:{
      value(newVal,oldVal){
        this.dynamicTags = newVal ? newVal : [];
      },
      dynamicTags(newVal){
        this.$emit('input',newVal);
      }
    },
    data() {
      return {
        dynamicTags: [],
        inputVisible: false,
        inputValue: ''
      }
    },
    methods: {
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },

      showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      handleInputConfirm() {
        let inputValue = this.inputValue
        if (inputValue) {
          this.dynamicTags.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      }
    }
  }
</script>
<style>
    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>


