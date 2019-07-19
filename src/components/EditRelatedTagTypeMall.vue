<template>
  <el-dialog :title="$t('edit')"
             v-if="dialogVisible"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%">
    <template>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form :model="modifyForm"
                   :rules="rules"
                   ref=modifyForm
                   label-width="140px"
                   class="demo-modifyForm">
            <el-form-item :label="$t('company_name')"
                          prop="CompanyName">
              <el-input v-model.trim="modifyForm.CompanyName" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('mall_name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.MallName" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('name')" prop="Id">
              <el-select v-model.trim="modifyForm.Id"
                         filterable
                         placeholder="...">
                <el-option v-for="item in tagTypes"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">
                </el-option>
              </el-select>
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
  return {
    Id: '',
    Name: '',
    CompanyName: '',
    MallName: ''
  }
}
export default {
  data () {
    return {
      dialogVisible: false,
      tagTypes: [],
      modifyForm: defaultForm(),
      rules: {
        Id: [
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
      this.selectTagTypes(form.CompanyId)
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async selectTagTypes (companyId) {
      let rep = await this.$store.dispatch({type: 'tagtype/selectTagTypeByCompanyId', data: {'CompanyId': companyId}})
      this.tagTypes = rep
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch({type: 'tagtype/saveTagTypeMall', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
