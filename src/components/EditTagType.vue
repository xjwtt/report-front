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
            <el-form-item :label="$t('company_name')" prop="CompanyId">
              <el-select v-model.trim="modifyForm.CompanyId"
                         filterable
                         placeholder="...">
                <el-option v-for="item in companys"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('description')"
                          prop="Description">
              <el-input v-model.trim="modifyForm.Description"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ranked')"
                          prop="Ranked">
              <el-input-number v-model="modifyForm.Ranked"></el-input-number>
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
    Name: '',
    CompanyId: '',
    Description: '',
    Ranked: 0
  }
}
export default {
  data () {
    return {
      dialogVisible: false,
      modifyForm: defaultForm(),
      rules: {
        CompanyId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Name: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      },
      companys: []
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
      this.selectCompany()
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async selectCompany () {
      let rep = await this.$store.dispatch({type: 'company/selectCompany'})
      this.companys = rep
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch({type: 'tagtype/saveOrUpdateTagType', data: this.modifyForm})
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
