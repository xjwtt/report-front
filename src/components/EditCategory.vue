<template>
  <el-dialog :title="$t('edit')"
             v-if="dialogVisible"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="60%">
    <template>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form :model="modifyForm"
                   :rules="rules"
                   ref=modifyForm
                   label-width="150px"
                   size="small"
                   class="demo-modifyForm">
            <el-form-item :label="$t('parent_name')"
                          prop="ParentName">
              <el-input :value="$t(parentName)" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="$t('name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('key_name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.KeyName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('data')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.Data"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ranked')"
                          prop="Ranked">
              <el-input-number v-model.trim="modifyForm.Ranked"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('description')"
                          prop="Description">
              <el-input v-model.trim="modifyForm.Description"></el-input>
            </el-form-item>
            <el-form-item :label="$t('is_enabled')"
                          prop="Visible">
              <el-radio v-model="modifyForm.Visible" :label="1">{{$t('start_using')}}</el-radio>
              <el-radio v-model="modifyForm.Visible" :label="-1">{{$t('block_up')}}</el-radio>
            </el-form-item>
          </el-form>
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
const defaultForm = () => {
  return {ParentId: '', Name: '', KeyName: '', Data: '', Ranked: 0, Description: '', Visible: 1}
}
export default {
  data () {
    return {
      dialogVisible: false,
      modifyForm: defaultForm(),
      parentName: '',
      rules: {
        Name: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        KeyName: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Data: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Ranked: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
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
      if (form.ParentId) {
        this.selectCategoryById(form.ParentId)
      }
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch({type: 'category/saveOrUpdateCategory', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
          this.$emit('categoryTree')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    },
    async selectCategoryById (id) {
      let rep = await this.$store.dispatch({type: 'category/selectCategoryById', data: {id: id}})
      this.parentName = rep.Name
    }
  }
}
</script>

<style scoped>

</style>
