<template>
  <el-dialog title="编辑"
             v-if="dialogVisible"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%">
    <template>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form :model="modifyForm"
                   :rules="rules"
                   ref=modifyForm
                   label-width="150px"
                   class="demo-modifyForm">
            <el-tabs v-model="activeName">

              <el-tab-pane name="基本配置"
                           label="基本配置">
                <el-form-item label="插件名称"
                              prop="Title">
                  <el-input v-model.trim="modifyForm.Title"></el-input>
                </el-form-item>
                <el-form-item label="详情链接"
                              prop="DetailLink"
                              class="insertHtml">
                  <el-input type="textarea"
                            v-model="modifyForm.DetailLink"></el-input>
                </el-form-item>
                <el-form-item label="最小宽度"
                              prop="minW">
                  <el-input v-model="modifyForm.minW"
                            placeholder="X"></el-input>
                </el-form-item>
                <el-form-item label="最小高度"
                              prop="minH">
                  <el-input v-model="modifyForm.minH"
                            placeholder="Y"></el-input>
                </el-form-item>

                <el-form-item label="是否手动刷新"
                              prop="ReflashButton">
                  <el-switch v-model="modifyForm.ReflashButton"
                             active-text="是"
                             inactive-text="否">
                  </el-switch>
                </el-form-item>
                <el-form-item label="自动刷新时间"
                              prop="ReflashInterval">
                  <el-input v-model.trim="modifyForm.ReflashInterval"></el-input>
                </el-form-item>
                <el-form-item label="排序"
                              prop="Sort">
                  <el-input-number v-model="modifyForm.Sort"
                                   placeholder="Y"></el-input-number>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name="默认显示"
                           label="默认显示">
                <codemirror v-if="activeName==='默认显示'"
                            v-model="modifyForm.DefaultDisplayData"
                            :options="{mode:'javascript',lineNumbers: true}"></codemirror>
              </el-tab-pane>
              <el-tab-pane name="显示模板"
                           label="显示模板">
                <codemirror v-if="activeName==='显示模板'"
                            v-model="modifyForm.Code"
                            :options="{mode:'htmlembedded',lineNumbers: true}"></codemirror>
              </el-tab-pane>
              <el-tab-pane name="请求参数"
                           label="请求参数">
                <codemirror v-if="activeName==='请求参数'"
                            v-model="modifyForm.QueryArgs"
                            :options="{mode:'javascript',lineNumbers: true}"></codemirror>
              </el-tab-pane>
              <el-tab-pane name="数据处理"
                           label="数据处理">
                <codemirror v-if="activeName==='数据处理'"
                            name="数据处理"
                            v-model="modifyForm.ResultProcessor"
                            :options="{mode:'javascript',lineNumbers: true}"></codemirror>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-col>
        <el-col :span="8">
          <customWidget style="width:300px;height:500px"
                        v-bind="modifyForm"
                        layoutMode></customWidget>
        </el-col>
      </el-row>
    </template>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="submitForm('modifyForm')">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import customWidget from '@/components/DynamicWidget'
import { codemirror } from 'vue-codemirror-lite'
require('codemirror/mode/htmlembedded/htmlembedded')
require('codemirror/mode/javascript/javascript')

let validateSize = (rule, value, callback) => {
  if (value === '' || value === null) {
    return callback(new Error('请输入尺寸'))
  } else if (value === '0') {
    return callback(new Error('尺寸必须是大于0'))
  } else if (!/^([0-9]+)$/.test(value)) {
    return callback(new Error('请输入合法字符'))
  } else {
    callback()
  }
}
const defaultForm = () => { return { Code: '', minH: 1, minW: 1, Id: null, QueryArgs: '', ResultProcessor: '', ChartsOption: '', DefaultDisplayData: '', ReflashButton: false, ReflashInterval: 10000, DetailLink: '', Sort: 0 } }
export default {
  data () {
    return {
      dialogVisible: false,
      activeName: '基本配置',
      modifyForm: defaultForm(),
      rules: {
        Title: [
          { required: true, message: '请输入插件名称', trigger: 'blur' }
        ],
        Code: [
          { required: true, message: '请填入代码', trigger: 'blur' }
        ],
        DefaultDisplayData: [
          { required: true, message: '请配置默认显示数据', trigger: 'blur' }
        ],
        QueryArgs: [
          { required: true, message: '请配置参数', trigger: 'blur' }
        ],
        minH: [
          { validator: validateSize, required: true, type: 'number', trigger: 'blur' }
        ],
        minW: [
          { validator: validateSize, required: true, type: 'number', trigger: 'blur' }
        ],
        Sort: [
          { required: true, type: 'number', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let rep = await this.$store.dispatch({ type: 'widget/addEditWidget', data: this.modifyForm })
          console.log(rep)
          this.dialogVisible = false
        } else {
          this.$message.error(this.$t('参数不正确'))
        }
      })
    }
  },
  components: {
    customWidget,
    codemirror
  },
  mounted () {
  }
}
</script>
