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
      :style="{width: width+35+'px'}"
      @input="handleKeyDown"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="mini" @click="showInput" type="danger" icon="el-icon-plus">添加
    </el-button>
    <br>
    <div style="opacity: 0;height: 20px">
      <span ref="spanTagInput">{{inputValue}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    watch: {
      value: {
        handler(newVal, oldVal) {
          this.dynamicTags = newVal ? newVal.split(',') : []
        },
        immediate: true
      },
      dynamicTags(newVal) {
        this.$emit('input', newVal.join(','))
      }
    },
    data() {
      return {
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        indexwidth:90,
        width: 90,
      }
    },
    methods: {
      handleKeyDown() {
        this.$nextTick(() => {
          this.width = this.$refs.spanTagInput.offsetWidth > this.indexwidth ? this.$refs.spanTagInput.offsetWidth : this.indexwidth
        })

      },
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
        this.inputValue = '';
        this.width = this.indexwidth;
      }
    }
  }
</script>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    /*margin-left: 10px;*/
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>


