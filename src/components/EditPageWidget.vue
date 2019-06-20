<template>
  <el-dialog :title="$t('edit')"
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

              <el-tab-pane name="BasicConfig"
                           :label="$t('basic_config')">
                <el-form-item :label="$t('plug_name')"
                              prop="Title">
                  <el-input v-model.trim="modifyForm.Title"></el-input>
                </el-form-item>
                <el-form-item :label="$t('detail_link')"
                              prop="DetailLink"
                              class="insertHtml">
                  <el-input type="textarea"
                            v-model="modifyForm.DetailLink"></el-input>
                </el-form-item>
                <el-form-item :label="$t('min_width')"
                              prop="minW">
                  <el-input v-model="modifyForm.minW"
                            placeholder="X"></el-input>
                </el-form-item>
                <el-form-item :label="$t('min_height')"
                              prop="minH">
                  <el-input v-model="modifyForm.minH"
                            placeholder="Y"></el-input>
                </el-form-item>

                <el-form-item :label="$t('manual_refresh')"
                              prop="ReflashButton">
                  <el-switch v-model="modifyForm.ReflashButton"
                             :active-text="$t('yes')"
                             :inactive-text="$t('not')">
                  </el-switch>
                </el-form-item>
                <el-form-item :label="$t('refresh_interval')"
                              prop="ReflashInterval">
                  <el-input v-model.trim="modifyForm.ReflashInterval"></el-input>
                </el-form-item>
                <el-form-item :label="$t('ranked')"
                              prop="Ranked">
                  <el-input-number v-model="modifyForm.Ranked"
                                   placeholder="Y"></el-input-number>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name="DefalutDisplay"
                           :label="$t('default_display')">
                <codemirror v-if="activeName==='DefalutDisplay'"
                            v-model="modifyForm.DefaultDisplayData"
                            :options="{mode:'javascript',lineNumbers: true}"></codemirror>
              </el-tab-pane>
              <el-tab-pane name="DisplayTemplate"
                           :label="$t('display_template')">
                <codemirror v-if="activeName==='DisplayTemplate'"
                            v-model="modifyForm.Code"
                            :options="{mode:'htmlembedded',lineNumbers: true}"></codemirror>
              </el-tab-pane>
              <el-tab-pane name="RequestParam"
                           :label="$t('request_param')">
                <codemirror v-if="activeName==='RequestParam'"
                            v-model="modifyForm.QueryArgs"
                            :options="{mode:'javascript',lineNumbers: true}"></codemirror>
              </el-tab-pane>
              <el-tab-pane name="DataProcessing"
                           :label="data_processing">
                <codemirror v-if="activeName==='DataProcessing'"
                            v-model="modifyForm.ResultProcessor"
                            :options="{mode:'javascript',lineNumbers: true}"></codemirror>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-col>
        <el-col :span="8">
          <custom-widget style="width:300px;height:500px"
                         v-bind="modifyForm"
                         layoutMode></custom-widget>
        </el-col>
      </el-row>
    </template>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="submitForm('modifyForm')">{{$t('ok')}}</el-button>
      <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import customWidget from '@/components/DynamicWidget'
import {codemirror} from 'vue-codemirror-lite'

require('codemirror/mode/htmlembedded/htmlembedded')
require('codemirror/mode/javascript/javascript')

let validateSize = (rule, value, callback) => {
  if (value === '' || value === null) {
    return callback(new Error(this.$t('please_enter_the_dimensions')))
  } else if (value === '0') {
    return callback(new Error(this.$t('size_must_be_greater_than_0')))
  } else if (!/^([0-9]+)$/.test(value)) {
    return callback(new Error(this.$t('please_enter_legitimate_characters')))
  } else {
    callback()
  }
}
const defaultForm = () => {
  return {
    Code: '',
    minH: 1,
    minW: 1,
    Id: null,
    QueryArgs: '',
    ResultProcessor: '',
    ChartsOption: '',
    DefaultDisplayData: '',
    ReflashButton: false,
    ReflashInterval: 10000,
    DetailLink: '',
    Ranked: 0
  }
}
export default {
  data () {
    return {
      dialogVisible: false,
      activeName: 'BasicConfig',
      modifyForm: defaultForm(),
      rules: {
        Title: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Code: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        DefaultDisplayData: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        QueryArgs: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        minH: [
          {
            validator: validateSize,
            required: true,
            type: 'number',
            message: this.$t('please_fill_in_the_value'),
            trigger: 'blur'
          }
        ],
        minW: [
          {
            validator: validateSize,
            required: true,
            type: 'number',
            message: this.$t('please_fill_in_the_value'),
            trigger: 'blur'
          }
        ],
        Ranked: [
          {required: true, type: 'number', message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
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
          await this.$store.dispatch({type: 'widget/addEditWidget', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
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
