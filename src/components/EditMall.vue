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
            <el-form-item :label="$t('province')" prop="ProvinceId">
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
            <el-form-item :label="$t('city')" prop="CityId">
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
            <el-form-item :label="$t('district')" prop="DistrictId">
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
            <el-form-item :label="$t('timezone')" prop="TimeZone">
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
            <el-form-item :label="$t('clerk_number')"
                          prop="ClerkNumber">
              <el-input v-model.trim="modifyForm.ClerkNumber"></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation_acreage')"
                          prop="OperationAcreage">
              <el-input v-model.trim="modifyForm.OperationAcreage"></el-input>
            </el-form-item>
            <el-form-item :label="$t('mall_code')"
                          prop="MallCode">
              <el-input v-model.trim="modifyForm.MallCode"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ranked')"
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
    MallCode: '',
    Enabled: 1
  }
}
const timeZones = () => {
  return _.map(['-12:00', '-11:30', '-11:00', '-10:30', '-10:00', '-09:30', '-09:00', '-08:30',
    '-08:00', '-07:30', '-07:00', '-06:30', '-06:00', '-05:30', '-05:00', '-04:30',
    '-04:00', '-03:30', '-03:00', '-02:30', '-02:00', '-01:30', '-01:00', '-00:30',
    '00:00',
    '+00:30', '+01:00', '+01:30', '+02:00', '+02:30', '+03:00', '+03:30', '+04:00',
    '+04:30', '+05:00', '+05:30', '+06:00', '+06:30', '+07:00', '+07:30', '+08:00',
    '+08:30', '+09:00', '+09:30', '+10:00', '+10:30', '+11:00', '+11:30', '+12:00'], (it) => {
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
      if (form && !form.DistrictId) {
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
