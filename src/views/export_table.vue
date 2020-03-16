<template>
  <div>
    <div class="config-page">
      <el-card class="box-card"
               style="flex:auto">
        <div slot="header"
             class="clearfix">
          <span>{{$t('export_table')}}</span>
        </div>
        <template>
          <el-col :span="18">
            <el-form :model="modifyForm"
                     :rules="rules"
                     ref=modifyForm
                     label-width="120px">
              <el-row>
                <el-col :span="8">
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
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('date')" prop="Date">
                    <el-date-picker
                      v-model="modifyForm.Date"
                      type="date"
                      :placeholder="$t('selection_date')">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('zone_types')"
                                prop="ZoneTypeId">
                    <el-select v-model.trim="modifyForm.ZoneType"
                               filterable
                               placeholder="...">
                      <el-option v-for="item in zoneTypes"
                                 :key="item.Name"
                                 :label="$t(item.Name)"
                                 :value="item.Name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('physical_name')"
                                prop="ZoneId">
                    <el-select v-model.trim="modifyForm.ZoneId"
                               filterable
                               placeholder="...">
                      <el-option v-for="item in zones"
                                 :key="item.Id"
                                 :label="item.Name"
                                 :value="item.Id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" @click="executeQuery()">{{$t('query')}}</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </template>
      </el-card>
    </div>
    <div class="report-page-card">
      <base-bigdata-table :fixed-col="0"
                          :header="header"
                          :table-data-handled="tableDataHandled"
                          :export-name="exportName"></base-bigdata-table>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import i18n from '@/i18n'
import moment from 'moment'
import {mapActions} from 'vuex'
import weekFun from '@/lib/weekFun'

const modifyForm = () => {
  return {
    MallId: '',
    ZoneType: '',
    ZoneId: '',
    Date: new Date()
  }
}
export default {
  data () {
    return {
      malls: [],
      modifyForm: modifyForm(),
      zoneTypes: [],
      zoneTypesMap: {},
      zones: [],
      zoneMap: {},
      companyMall: {CompanyName: '', MallLocation: ''},
      allZoneTypes: ['Entrance', 'Corridor', 'Floor', 'Domain'],
      header: [],
      data: [],
      rules: {
        MallId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Date: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    exportName () {
      return 'export_table_' + moment(this.modifyForm.Date).format('YYYYMMDD')
    },
    tableDataHandled () {
      const t = key => i18n.t(key)
      let that = this
      let data = this.data['report'] ? this.data['report'][0] : []
      let result = []
      if (data.length > 0) {
        that.header = ['会社コード', 'エリアコード', '店舗コード', 'ゲートコード', '対象年月日', 'データ種别', '曜日フラグ', '祝祭日フラグ']
        let mall = _.find(this.malls, (v) => {
          return v.Id === this.modifyForm.MallId
        })
        let mallName = mall ? mall.Name : ''
        let date = moment(this.modifyForm['Date'])
        let groupData = _.groupBy(data, (v) => {
          return v.DomainLabel
        })
        let v0 = []
        _.each(groupData, (v, k) => {
          let enter = [this.companyMall.CompanyName, this.companyMall.MallLocation, mallName, v[0].DomainLabel, date.format('YYYYMMDD'), '1', '"' + date.weekday() + '": ' + weekFun.GetWeek(t, this.modifyForm['Date']), '']
          let exit = [this.companyMall.CompanyName, this.companyMall.MallLocation, mallName, v[0].DomainLabel, date.format('YYYYMMDD'), '2', '"' + date.weekday() + '": ' + weekFun.GetWeek(t, this.modifyForm['Date']), '']
          v0 = v
          for (let j = 0; j < v.length; j++) {
            enter.push(v[j].Enter)
            exit.push(v[j].Exit)
            // if (i === 0) {
            //   that.header.push(data[i].DateTime + '時のデータ数')
            // }
          }
          result.push(enter)
          result.push(exit)
        })
        for (let i = 0; i < v0.length; i++) {
          that.header.push(data[i].DateTime + '時のデータ数')
        }
      }
      return result
    }
  },
  methods: {
    ...mapActions('report', ['query']),
    async selectCompanyMall () {
      let rep = await this.$store.dispatch({type: 'mall/selectCompanyMall'})
      this.malls = rep
    },
    async selectZone (mallId) {
      let rep = await this.$store.dispatch({type: 'zone/select', mallIds: [mallId]})
      this.zoneMap = _.groupBy(rep, (v) => v.ZoneTypeName)
    },
    async executeQuery () {
      let query = {}
      query['report'] = {
        dateFields: ['Enter', 'Exit'],
        groupBy: [
          {domain: 'Zone', period: '60m', timeFormatter: 'yyyy-MM-dd HH:mm'}
        ],
        st: moment(this.modifyForm['Date']).format('YYYY-MM-DD'),
        et: moment(this.modifyForm['Date']).format('YYYY-MM-DD')
      }
      if (this.modifyForm.ZoneId !== '-') {
        query['report']['PhyIds'] = [this.modifyForm.ZoneId]
      } else {
        query['report']['mallIds'] = [this.modifyForm.MallId]
        query['report']['ZoneType'] = [this.modifyForm.ZoneType]
      }
      this.selectCompanyMallByMallid()
      this.data = await this.query(query)
    },
    async selectCompanyMallByMallid () {
      let rep = await this.$store.dispatch({
        type: 'mall/selectCompanyMallByMallid',
        data: {Id: this.modifyForm.MallId}
      })
      this.companyMall = rep
    }
  },
  watch: {
    'modifyForm.MallId':
        {
          handler: function (newValue, OldValue) {
            this.selectZone(newValue)
            this.modifyForm.ZoneType = ''
            this.modifyForm.ZoneId = ''
          },
          deep: true
        },
    'modifyForm.ZoneType':
        {
          handler: function (newValue, OldValue) {
            this.zones = this.zoneTypesMap[newValue]
          },
          deep: true
        },
    zoneMap: {
      handler: function (newValue, OldValue) {
        this.zoneTypesMap = {}
        this.zoneTypes = []
        for (let i = 0; i < this.allZoneTypes.length; i++) {
          let key = this.allZoneTypes[i]
          let temp = this.zoneMap[key]
          if (temp) {
            this.zoneTypesMap[key] = [{Id: '-', Name: '....'}].concat(temp)
            this.zoneTypes.push({Name: key})
          }
        }
        if (this.zoneTypes.length > 0) {
          this.modifyForm.ZoneType = this.zoneTypes[0].Name
        }
      },
      deep: true
    }

  },
  activated () {
    this.selectCompanyMall()
  }
}
</script>

<style scoped>

</style>
