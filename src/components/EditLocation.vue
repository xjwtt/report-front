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
              <el-tab-pane :label="$t('base')" name="base">
                <el-form-item :label="$t('parent_name')"
                              prop="ParentName">
                  <el-input v-model.trim="parentName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item :label="$t('name')"
                              prop="Name">
                  <el-input v-model.trim="modifyForm.Name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('ranked')"
                              prop="Ranked">
                  <el-input-number v-model.trim="modifyForm.Ranked"></el-input-number>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane :label="$t('get_weather')" name="getWeather">
                <el-form-item :label="$t('get_weather')"
                              prop="GetWeather">
                  <el-radio v-model="modifyForm.GetWeather" :label="1">{{$t('acquire')}}</el-radio>
                  <el-radio v-model="modifyForm.GetWeather" :label="-1">{{$t('not_acquire')}}</el-radio>
                </el-form-item>
                <el-form-item :label="$t('weather_api_type')"
                              prop="WeatherApiType">
                  <el-select v-model.trim="modifyForm.WeatherApiType" filterable placeholder="...">
                    <el-option v-for="item in weatherApiTypes"
                               :key="item.KeyName"
                               :label="$t(item.Name)"
                               :value="item.KeyName">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('weather_language')"
                              prop="WeatherLanguage">
                  <el-select v-model.trim="modifyForm.WeatherLanguage" filterable placeholder="...">
                    <el-option v-for="item in languageTypes"
                               :key="item.KeyName"
                               :label="$t(item.Name)"
                               :value="item.Data">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('temp_unit')"
                              prop="TempUnit">
                  <el-select v-model.trim="modifyForm.Unit" filterable placeholder="...">
                    <el-option v-for="item in tempUnits"
                               :key="item.KeyName"
                               :label="$t(item.Name)"
                               :value="item.Data">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('location_search')">
                  <el-select
                    v-model="location"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="..."
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                      v-for="item in findLocations"
                      :key="item.cid"
                      :label="item.location"
                      :value="item.location">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('weather_code')"
                              prop="WeatherCode">
                  <el-input v-model.trim="modifyForm.WeatherCode" :disabled="true"></el-input>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
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

export default {
  name: 'EditMenu',
  data () {
    return {
      activeName: 'base',
      dialogVisible: false,
      modifyForm: null,
      parentName: '',
      weatherApiTypes: [],
      languageTypes: [],
      tempUnits: [],
      ApiKey: null,
      location: '',
      loading: false,
      findLocations: [],
      rules: {
        Name: [
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
        this.selectLocationById(form.ParentId)
      }
      this.activeName = 'base'
      this.location = ''
      form.WeatherCode = form.WeatherCode ? form.WeatherCode : ''
      form.WeatherApiType = form.WeatherApiType ? form.WeatherApiType : 'HeFeng'
      form.WeatherLanguage = form.WeatherLanguage ? form.WeatherLanguage : 'zh-cn'
      form.Unit = form.Unit ? form.Unit : 'm'
      if (form.WeatherCode) {
        let codes = form.WeatherCode.split(',')
        if (codes.length >= 2) {
          this.longitude = codes[0]
          this.latitude = codes[1]
        } else if (codes.length === 1) {
          this.longitude = codes[0]
        }
      }
      this.modifyForm = Object.assign({}, form)
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.modifyForm.GetWeather === 1) {
            if (this.modifyForm.WeatherCode.length <= 0) {
              this.$message.error(this.$t('weather_code_not_be_empty'))
              return false
            }
          }
          await this.$store.dispatch({type: 'location/saveOrUpdateLocation', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
          this.$emit('loadLocationTree')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    },
    async selectLocationById (id) {
      let rep = await this.$store.dispatch({type: 'location/selectLocationById', data: {id: id}})
      this.parentName = rep.Name
    },
    async selectWeatherApiType () {
      let rep = await this.$store.dispatch({
        type: 'category/selectCategoryByKeyName',
        data: {KeyName: 'WeatherApiType'}
      })
      this.weatherApiTypes = rep
    },
    async selectWeatherLanguage () {
      let rep = await this.$store.dispatch({
        type: 'category/selectCategoryByKeyName',
        data: {KeyName: 'WeatherLanguageType'}
      })
      this.languageTypes = rep
    },
    async selectTempUnit () {
      let rep = await this.$store.dispatch({
        type: 'category/selectCategoryByKeyName',
        data: {KeyName: 'TempUnit'}
      })
      this.tempUnits = rep
    },
    async remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        let data = await this.$store.dispatch({
          type: 'location/findHefengLocation',
          data: {Location: query, WeatherLanguage: this.modifyForm.WeatherLanguage, ApiKey: this.ApiKey}
        })
        this.findLocations = data
        this.loading = false
      } else {
        this.findLocations = []
      }
    }
  },
  watch: {
    'modifyForm.WeatherLanguage': {
      handler: function (newValue, OldValue) {
        _.each(this.weatherApiTypes, (v) => {
          if (v.KeyName === newValue) {
            this.ApiKey = v.Data
          }
        })
      },
      deep: true
    },
    location: {
      handler: function (newValue) {
        this.modifyForm.WeatherCode = newValue
      }
    }
  },
  activated () {
    this.selectWeatherApiType()
    this.selectWeatherLanguage()
    this.selectTempUnit()
  }
}
</script>

<style scoped>

</style>
