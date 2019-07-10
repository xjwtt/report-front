<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('weather_manager')}}</span>
      </div>
      <datatable v-bind="$data">
        <slot>
          <div class="pull-right"
               style="margin:0 5px">
            <button :title="$t('get_today_weather')"
                    class="btn btn-default"
                    type="button"
                    @click="getTodayWeather()">
              <i class="fa" :class="'el-icon-success'"></i>
            </button>
          </div>
        </slot>
      </datatable>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'weather_manager',
  data: () => ({
    // table
    supportBackup: true,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'city', field: 'CityName', thComp: 'th-filter', sortable: true},
      {title: 'date', field: 'Date', thComp: 'th-filter', sortable: true},
      {title: 'weatherName', field: 'WeatherName', thComp: 'th-i18n'},
      {title: 'highTemp', field: 'HighTemp', thComp: 'th-i18n'},
      {title: 'lowTemp', field: 'LowTemp', thComp: 'th-i18n'},
      {title: 'pm25', field: 'PM25', thComp: 'th-i18n'},
      {title: 'wind', field: 'Wind', thComp: 'th-i18n'}
    ],
    data: [],
    total: 0,
    query: {'time_': 0},
    selection: [],
    xprops: {
      eventbus: new Vue()
    }
  }),
  methods: {
    async getTodayWeather () {
      await this.$store.dispatch({type: 'weather/getTodayWeather', data: this.query})
      this.$message.success(this.$t('success'))
      this.handleQueryChange()
    },
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'weather/weatherGrid', data: this.query})
      this.total = rep.total
      this.data = rep.list
    }
  },
  activated () {
    // time_保证每次进入页面都会获取最新数据 防止数据修改页面没有拿到最新数据
    this.query['time_'] = (new Date()).getTime()
  },
  watch: {
    query: {
      handler (nValue) {
        if (nValue.time_ !== 0) {
          this.handleQueryChange()
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
