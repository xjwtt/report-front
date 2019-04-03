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
            <el-form-item :label="$t('physical_name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('mall')"
                          prop="MallId">
              <el-select v-model.trim="modifyForm.MallId"
                         filterable
                         placeholder="...">
                <el-option v-for="item in malls"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('type')"
                          prop="ZoneTypeId">
              <el-select v-model.trim="modifyForm.ZoneTypeId"
                         filterable
                         placeholder="...">
                <el-option v-for="item in zoneTypes"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Ranked')"
                          prop="Ranked">
              <el-input-number v-model="modifyForm.Ranked"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('is_enabled')"
                          prop="Enabled">
              <el-radio v-model="modifyForm.Enabled" :label="1">{{$t('start_using')}}</el-radio>
              <el-radio v-model="modifyForm.Enabled" :label="-1">{{$t('block_up')}}</el-radio>
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
    MallId: '',
    Name: '',
    ZoneTypeId: '',
    Ranked: 0,
    Enabled: 1
  }
}
export default {
  name: 'EditCompany',
  data () {
    return {
      dialogVisible: false,
      modifyForm: defaultForm(),
      rules: {
        MallId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Name: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        ZoneTypeId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Ranked: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      },
      malls: [],
      zoneTypes: []
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
      this.selectCompanyMall()
      this.selectCategoryByKeyName()
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch({type: 'physical/saveOrUpdatePhysical', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    },
    async selectCompanyMall () {
      let rep = await this.$store.dispatch({type: 'mall/selectCompanyMall'})
      this.malls = rep
    },
    async selectCategoryByKeyName () {
      let rep = await this.$store.dispatch({type: 'category/selectCategoryByKeyName', data: {KeyName: 'ZoneTypes'}})
      this.zoneTypes = rep
    }
  }
}
</script>

<style scoped>

</style>
