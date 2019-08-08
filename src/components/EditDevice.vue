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
            <el-form-item :label="$t('mall')" prop="MallId">
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
            <el-form-item :label="$t('device_id')"
                          prop="DeviceId">
              <el-input v-model.trim="modifyForm.DeviceId"></el-input>
            </el-form-item>
            <el-form-item :label="$t('device_type')"
                          prop="DeviceType">
              <el-select v-model.trim="modifyForm.DeviceType"
                         filterable
                         placeholder="...">
                <el-option v-for="item in deviceTypes"
                           :key="item.Id"
                           :label="$t(item.Name)"
                           :value="item.Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('position')"
                          prop="Position">
              <el-input v-model.trim="modifyForm.Position"></el-input>
            </el-form-item>
            <el-form-item :label="$t('IP')"
                          prop="IpAddress">
              <el-input v-model.trim="modifyForm.IpAddress"></el-input>
            </el-form-item>
            <el-form-item :label="$t('serial_number')"
                          prop="SerialNumber">
              <el-input v-model.trim="modifyForm.SerialNumber"></el-input>
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
    Id: '',
    DeviceId: '',
    DeviceType: '',
    Position: '',
    IpAddress: '',
    SerialNumber: '',
    Enabled: 1
  }
}
export default {
  name: 'EditDevice',
  data () {
    return {
      dialogVisible: false,
      modifyForm: defaultForm(),
      rules: {
        MallId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        DeviceId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        DeviceType: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      },
      malls: [],
      deviceTypes: []
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.activeName = 'device'
      this.selectCompanyMall()
      this.selectCategoryByKeyName()
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch({type: 'device/saveOrUpdateDevice', data: this.modifyForm})
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
      let rep = await this.$store.dispatch({type: 'category/selectCategoryByKeyName', data: {KeyName: 'DeviceType'}})
      this.deviceTypes = rep
    }
  }
}
</script>

<style scoped>

</style>
