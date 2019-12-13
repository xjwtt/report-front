<template>
  <div>
    <div class="config-page">
      <el-card class="box-card"
               style="flex:auto">
        <div slot="header"
             class="clearfix">
          <span>{{$t('export_manager')}}</span>
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
                          :export-name="'show_case_analysis'"></base-bigdata-table>
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
      header: ['No', '項目名', '項目内容', 'DB対応項目名称'],
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
    tableDataHandled () {
      const t = key => i18n.t(key)
      let data = this.data['report'] ? this.data['report'][0] : []
      let result = []
      if (data.length > 0) {
        let mall = _.find(this.malls, (v) => {
          return v.Id === this.modifyForm.MallId
        })
        let mallName = mall ? mall.Name : ''
        let zoneName = ''
        if (this.modifyForm.ZoneId === '-') {
          zoneName = this.$t(this.modifyForm.ZoneType)
        } else {
          let zone = _.find(this.zones, (v) => {
            return v.Id === this.modifyForm.ZoneId
          })
          zoneName = zone ? zone.Name : ''
        }

        let date = moment(this.modifyForm['Date'])

        result = [[1, '会社コード', this.companyMall.CompanyName, 'CORP_CD'],
          [2, 'エリアコード', this.companyMall.MallLocation, 'AREA_CD'],
          [3, '店舗コード', mallName, 'STORE_CD'],
          [4, 'ゲートコード', zoneName, 'GATE_CD'],
          [5, '対象年月日', date.format('YYYYMMDD'), 'DAY'],
          [6, 'データ種别', '"1":入店客数 "2":出店的客数', 'DATAF'],
          [7, '曜日フラグ', ' "' + date.weekday() + '": ' + weekFun.GetWeek(t, this.modifyForm['Date']), 'WEEKA'],
          [8, '祝祭日フラグ', '', 'WEEKB']
        ]
        let enterTotal = 0
        let exitTotal = 0
        for (let i = 0; i < data.length; i++) {
          enterTotal += data[i].Enter
          exitTotal += data[i].Exit
        }
        let enterPrefix = ' "1": '
        let exitPrefix = ' "2": '
        result.push([9, '1日の合計データ数', enterPrefix + enterTotal + exitPrefix + exitTotal, 'CNT'])
        for (let i = 0; i < data.length; i++) {
          result.push([10 + i, data[i].DateTime + '時のデータ数', enterPrefix + data[i].Enter + exitPrefix + data[i].Exit, 'CNT' + i])
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
          {domain: 'All', period: '60m', timeFormatter: 'yyyy-MM-dd HH:mm'}
        ],
        st: moment(this.modifyForm['Date']).format('YYYY-MM-DD'),
        et: moment(this.modifyForm['Date']).format('YYYY-MM-DD')
      }
      if (this.modifyForm.ZoneId === '-') {
        query['report']['PhyIds'] = [this.modifyForm.ZoneId]
      } else {
        query['report']['mallIds'] = [this.modifyForm.MallId]
        query['report']['ZoneType'] = [this.modifyForm.ZoneType]
      }
      this.selectCompanyMallByMallid()
      this.data = await this.query(query)
    },
    async selectCompanyMallByMallid () {
      let rep = await this.$store.dispatch({type: 'mall/selectCompanyMallByMallid', data: {Id: this.modifyForm.MallId}})
      this.companyMall = rep
    }
  },
  watch: {
    'modifyForm.MallId': {
      handler: function (newValue, OldValue) {
        this.selectZone(newValue)
        this.modifyForm.ZoneType = ''
        this.modifyForm.ZoneId = ''
      },
      deep: true
    },
    'modifyForm.ZoneType': {
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
