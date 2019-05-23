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
                          prop="Name">
              <el-input v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Company')" prop="CompanyId">
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
            <el-form-item :label="$t('ProvinceId')" prop="ProvinceId">
              <el-select v-model.trim="modifyForm.ProvinceId"
                         filterable
                         placeholder="...">
                <el-option v-for="item in provinces"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">

                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('CityId')" prop="CityId">
              <el-select v-model.trim="modifyForm.CityId"
                         filterable
                         placeholder="...">
                <el-option v-for="item in citys"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">

                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('DistrictId')" prop="DistrictId">
              <el-select v-model.trim="modifyForm.DistrictId"
                         filterable
                         placeholder="...">
                <el-option v-for="item in districts"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">

                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('TimeZone')" prop="TimeZone">
              <el-select v-model.trim="modifyForm.TimeZone"
                         filterable
                         placeholder="...">
                <el-option v-for="item in timeZones"
                           :key="item.Id"
                           :label="item.Id"
                           :value="item.Id">

                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('ClerkNumber')"
                          prop="ClerkNumber">
              <el-input v-model.trim="modifyForm.ClerkNumber"></el-input>
            </el-form-item>
            <el-form-item :label="$t('OperationAcreage')"
                          prop="OperationAcreage">
              <el-input v-model.trim="modifyForm.OperationAcreage"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Ranked')"
                          prop="Ranked">
              <el-input-number v-model.trim="modifyForm.Ranked"></el-input-number>
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
import _ from 'underscore'

const defaultForm = () => {
  return {
    Name: '',
    CompanyId: '',
    ProvinceId: '',
    CityId: '',
    DistrictId: '',
    TimeZone: 'Asia/Shanghai',
    ClerkNumber: 0,
    OperationAcreage: 0,
    Ranked: 0,
    Enabled: 1
  }
}
const timeZones = () => {
  return _.map(['Asia/Shanghai', 'Asia/Ho_Chi_Minh', 'Pacific/Guadalcanal', 'America/Los_Angeles', 'America/Puerto_Rico', 'America/Phoenix', 'Asia/Karachi', 'Pacific/Auckland', 'Asia/Yerevan', 'Pacific/Apia', 'Asia/Tokyo', 'Asia/Kolkata', 'America/Indiana/Indianapolis', 'Europe/Paris', 'Africa/Addis_Ababa', 'America/Chicago', 'America/St_Johns', 'Africa/Harare', 'Asia/Dhaka', 'America/Sao_Paulo', 'America/Anchorage', 'Africa/Cairo', 'America/Argentina/Buenos_Aires', 'Australia/Sydney', 'Australia/Darwin'], function (it) {
    return {Id: it}
  })
}
export default {
  name: 'EditCompany',
  data () {
    return {
      dialogVisible: false,
      modifyForm: defaultForm(),
      rules: {
        Name: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        CompanyId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        ProvinceId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        CityId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        TimeZone: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      },
      timeZones: timeZones(),
      companys: [],
      provinces: [],
      citys: [],
      districts: []

    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
      this.selectCompany()
      this.parentIdLocation('-', 'province')
      if (!form.DistrictId) {
        form.DistrictId = ''
      }
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch({type: 'mall/saveOrUpdateMall', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    },
    async selectCompany () {
      let rep = await this.$store.dispatch({type: 'company/selectCompany'})
      this.companys = rep
    },
    async parentIdLocation (parentId, type) {
      let rep = await this.$store.dispatch({
        type: 'location/parentIdLocation',
        data: {parentId: parentId}
      })
      switch (type) {
        case 'province':
          this.provinces = rep
          break
        case 'city':
          this.citys = rep
          break
        case 'district':
          this.districts = rep
          break
      }
      if (type === 'pro') {
        this.provinces = rep
      }
    }
  },
  watch: {
    'modifyForm.ProvinceId': {
      handler: function (newValue, OldValue) {
        this.parentIdLocation(newValue, 'city')
      },
      deep: true
    },
    'modifyForm.CityId': {
      handler: function (newValue, OldValue) {
        this.parentIdLocation(newValue, 'district')
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
