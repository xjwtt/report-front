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
            <el-form-item :label="$t('mall_name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('所属集团')" prop="CompanyId">
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
            <el-form-item :label="$t('省/直辖市')" prop="ProvinceId">
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
            <el-form-item :label="$t('城市')" prop="CityId">
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
            <el-form-item :label="$t('区/县')" prop="DistrictId">
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
            <el-form-item :label="$t('时区')" prop="TimeZone">
              <el-select v-model.trim="modifyForm.TimeZone"
                         filterable
                         placeholder="...">
                <el-option v-for="item in timeZones"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">

                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('店员数')"
                          prop="ClerkNumber">
              <el-input v-model.trim="modifyForm.ClerkNumber"></el-input>
            </el-form-item>
            <el-form-item :label="$t('面积')"
                          prop="OperationAcreage">
              <el-input v-model.trim="modifyForm.OperationAcreage"></el-input>
            </el-form-item>
            <el-form-item :label="$t('序号')"
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
                 @click="submitForm('modifyForm')">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
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
    TimeZone: 8,
    ClerkNumber: 0,
    OperationAcreage: 0,
    Ranked: 0,
    Enabled: 1
  }
}
const timeZones = () => {
  return _.map([-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], function (it) {
    return {Id: it, Name: it + '区'}
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
          {required: true, message: this.$t('please_enter_the_field_name'), trigger: 'blur'}
        ],
        CompanyId: [
          {required: true, message: this.$t('please_enter_the_field_name'), trigger: 'blur'}
        ],
        ProvinceId: [
          {required: true, message: this.$t('please_enter_the_field_name'), trigger: 'blur'}
        ],
        CityId: [
          {required: true, message: this.$t('please_enter_the_field_name'), trigger: 'blur'}
        ],
        TimeZone: [
          {required: true, message: this.$t('please_enter_the_field_name'), trigger: 'blur'}
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
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch({type: 'mall/saveOrUpdateMall', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
        } else {
          this.$message.error(this.$t('参数不正确'))
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
        this.parentIdLocation(this.modifyForm.CityId, 'district')
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
