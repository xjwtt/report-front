<template>
  <div class="widget">
    <div class="title">
      {{ $t(Title) }}
      <div class="right">
        <i v-if="!showHideButton && ReflashButton && !loading"
           class="el-icon-refresh"
           @click="queryData()"></i>
        <span v-if="showHideButton"
              style="cursor:pointer"
              @click="$emit('delete-widget')">
          <i class="el-icon-view"></i>{{$t('hide')}}</span>
      </div>
    </div>
    <div class="body"
         v-loading="loading">
      <component v-if="isMounted"
                 :is="dynamicComponent"
                 :D="DisplayMap"
                 style="width:100%"></component>
    </div>
    <div v-if="DetailLink"
         class="bottom">
      <a :href="DetailLink">{{$t('check_details')}}</a>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-new-func */
import moment from 'moment'
import _ from 'underscore'
import ajax from '@/lib/ajax'

export default {
  name: 'DynamicWidget',
  props: {
    Id: Number,
    Title: String,
    ReflashButton: Boolean,
    ReflashInterval: Number,
    DetailLink: String,
    Code: String,
    DefaultDisplayData: String,
    QueryArgs: String,
    ResultProcessor: String,

    // 布局模式 不做实际请求
    layoutMode: Boolean,
    showHideButton: Boolean,

    //
    selectMalls: Array,
    upDateTime: Array
  },
  data () {
    return {
      isMounted: false,
      loading: false,
      error: null,

      DisplayMap: null,
      queryArgsFn: null,
      resultProcessorFn: null,

      timer: null
    }
  },
  methods: {
    async queryData (isSetTimer) {
      if (this.error || this.layoutMode || !this.queryArgsFn) {
        return
      }
      this.loading = true
      // args
      let dates = _.clone(this.upDateTime)
      let queryArgs = null

      try {
        queryArgs = this.queryArgsFn(dates, moment)
      } catch (e) {
        this.error = `<div>Run QueryArgsFn Error<br>${e}</div>`
        this.loading = false
        return
      }

      for (let key in queryArgs) {
        if (!queryArgs[key].StartDate) {
          queryArgs[key].StartDate = moment(dates[0]).format('YYYY-MM-DD')
        } else {
          queryArgs[key].StartDate = moment(queryArgs[key].StartDate).format('YYYY-MM-DD')
        }
        if (!queryArgs[key].EndDate) {
          queryArgs[key].EndDate = moment(dates[1]).format('YYYY-MM-DD')
        } else {
          queryArgs[key].EndDate = moment(queryArgs[key].EndDate).format('YYYY-MM-DD')
        }
        if (!queryArgs[key].Locations) {
          queryArgs[key].Locations = {MallIds: _.pluck(this.selectMalls, 'Id')}
        }
        if (queryArgs[key].Locations && !queryArgs[key].Locations.MallIds) {
          queryArgs[key].Locations.MallIds = _.pluck(this.selectMalls, 'Id')
        }
      }

      // try {
      //   debugger
      //   var queryArgs = this.queryArgsFn(dates, moment)
      //   if (!queryArgs.StartDate) {
      //     queryArgs.StartDate = moment(dates[0]).format('YYYY-MM-DD')
      //   }
      //   if (!queryArgs.EndDate) {
      //     queryArgs.EndDate = moment(dates[1]).format('YYYY-MM-DD')
      //   }
      //   if (!queryArgs.Locations) {
      //     queryArgs.Locations = {MallIds: _.pluck(this.selectMalls, 'Id')}
      //   }
      // } catch (e) {
      //   this.error = `<div>Run QueryArgsFn Error<br>${e}</div>`
      //   this.loading = false
      //   return
      // }

      let res
      try {
        res = await ajax.post('/report/GlobalReport.action', queryArgs, {skipInterceptors: true})
      } catch (e) {
        this.error = '<div>Run Query Error</div>'
        return
      } finally {
        this.loading = false
      }

      try {
        this.resultProcessorFn(res, this.DisplayMap, _)
      } catch (e) {
        this.error = `<div>Run resultProcessorFn Error<br>${e}</div>`
        return
      }
      if (isSetTimer && this.ReflashInterval > 0) {
        this.timer = setInterval(this.queryData, this.ReflashInterval * 1000)
      }
    }
  },
  errorCaptured (err, vm, info) {
    this.error = `<div>Error<br>${err}</div>`
    return false
  },
  computed: {
    dynamicComponent () {
      let template = this.error ? this.error : this.Code ? this.Code : '<div>Empty</div>'
      return {
        template: template,
        props: {D: {type: Object}},
        filters: {
          compare: function (raw, compareTo) {
            if (typeof (raw) === 'number' && typeof (compareTo) === 'number') {
              return compareTo === 0 ? '-' : (raw / compareTo * 100).toFixed(2) + '%'
            } else {
              return '-'
            }
          },
          fixed: function (a, b) {
            return typeof (a) === 'number' ? a.toFixed(b) : a
          },
          floor: function (a) {
            return Math.floor(a)
          }
        }
      }
    }
  },
  watch: {
    upDateTime (newval, oldval) {
      this.queryData()
    },
    selectMalls (newval, oldval) {
      this.queryData()
    }
  },
  created () {
    let watched = ['DefaultDisplayData', 'Code', 'QueryArgs', 'ResultProcessor']
    watched.forEach(prop => {
      this.$watch(prop, () => {
        this.error = null
        try {
          this.DisplayMap = new Function('c', 't', `${this.DefaultDisplayData}`)(null, (_) => {
            return this.$t(_)
          })
        } catch (e) {
          this.error = `<div>Init DefaultDisplayData Error<br>${e}</div>`
          return
        }
        if (!this.QueryArgs || this.QueryArgs.length === 0) {
          this.queryArgsFn = null
          return
        }
        try {
          this.queryArgsFn = new Function('d', 'm', `${this.QueryArgs}`)
        } catch (e) {
          this.error = `<div>Init QueryArgsFn Error<br>${e}</div>`
          return
        }
        try {
          this.resultProcessorFn = new Function('r', 'D', '_', `${this.ResultProcessor}`)
        } catch (e) {
          this.error = `<div>Init ResultProcessorFn Error<br>${e}</div>`
        }
      }, {immediate: true})
    })

    // this.queryData(true)
  },
  activated () {
    this.queryData(true)
  },
  deactivated () {
    clearInterval(this.timer)
  },
  mounted () {
    this.$nextTick(() => {
      this.isMounted = true
    })
  }
}
</script>

<style>
  .widget {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    border: 1px solid #ccc;
    box-shadow: 5px 5px 5px #ccc;
  }

  .widget > .title {
    height: 50px;
    line-height: 50px;
    background: #dedede;
    font-size: 14px;
    padding-left: 15px;
    padding-right: 10px;
  }

  .widget > .title > .right {
    float: right;
    font-size: 26px;
  }

  .widget > .body {
    flex: 1 1;
    display: flex;
  }

  .widget > .body > .root {
    width: 100%;
    height: 100%;
  }

  /* .widget > .body :first-child {
    width: 100%;
    height: 100%;
  } */

  .widget > .bottom {
    height: 30px;
    background: #dedede;
  }

  .widget > .bottom > a {
    line-height: 30px;
    display: block;
    text-align: center;
    color: #0275d8;
    text-decoration: none;
  }
</style>
