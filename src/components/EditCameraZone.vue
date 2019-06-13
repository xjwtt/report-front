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
            <el-form-item :label="$t('mall_name')"
                          prop="MallName">
              <el-input v-model.trim="modifyForm.MallName" readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('device_id')"
                          prop="DeviceId">
              <el-input v-model.number="modifyForm.DeviceId" readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('zone')"
                          prop="Zone">
              <el-input v-model.number="modifyForm.Zone"></el-input>
            </el-form-item>
            <el-form-item :label="$t('zone_class')"
                          prop="ZoneClass">
              <el-radio v-model="modifyForm.ZoneClass" label="Count">{{$t('zoneClass_Count')}}</el-radio>
              <el-radio v-model="modifyForm.ZoneClass" label="Passby">{{$t('zoneClass_PassBy')}}</el-radio>
              <el-radio v-model="modifyForm.ZoneClass" label="Fitting">{{$t('zoneClass_Fitting')}}</el-radio>
              <el-radio v-model="modifyForm.ZoneClass" label="Dwell">{{$t('zoneClass_Dwell')}}</el-radio>
              <el-radio v-model="modifyForm.ZoneClass" label="Queue">{{$t('zoneClass_Queue')}}</el-radio>
              <el-radio v-model="modifyForm.ZoneClass" label="Alarm">{{$t('zoneClass_Alarm')}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('is_enabled')"
                          prop="Status">
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
  return {MallName: '', DeviceId: '', ZoneClass: 'Count', Enabled: 1}
}
export default {
  name: 'EditCameraZone',
  data () {
    return {
      dialogVisible: false,
      modifyForm: defaultForm(),
      rules: {
        Name: [
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
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch({type: 'cameraZone/saveOrUpdateCameraZone', data: this.modifyForm})
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
