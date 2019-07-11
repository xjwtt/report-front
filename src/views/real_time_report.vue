<template>
  <div class="context-page"
       onselectstart="return false">
    <div class="header">
      <div>
        <span class="title">{{this.$t('real_time_report') }}</span>
      </div>
      <div class="right">
        <div v-show="!editMode">
          <span>{{$t('selection_date')}}： </span>
          <el-date-picker v-model="dateValue"
                          type="daterange"
                          align="right"
                          :editable="false"
                          :clearable="false"
                          :placeholder="$t('selection_date')"
                          style="width:230px"
                          :picker-options="pickerOptions">
          </el-date-picker>
          <el-button class="button"
                     @click="editMode=true">{{this.$t('personalized_home_page')}}
          </el-button>
        </div>
        <div class="button"
             v-show="editMode">
          <el-button @click="addWidget">{{$t('add_plugin-in')}}</el-button>
          <el-button @click="resetWidget">{{$t('restore_default')}}</el-button>
          <el-button @click="saveWidget">{{$t('save_layout')}}</el-button>
          <el-button @click="recoveryWidget">{{$t('return')}}</el-button>
        </div>
      </div>
    </div>
    <div class="briefReport">
      <grid-layout :layout="userWidgets"
                   :col-num="16"
                   :row-height="100"
                   :is-draggable="editMode"
                   :is-resizable="editMode"
                   :is-mirrored="false"
                   :vertical-compact="true"
                   :margin="[10, 10]"
                   :use-css-transforms="true">
        <grid-item v-for="(element,index) in userWidgets"
                   :key="element.Id"
                   :x="element.x"
                   :y="element.y"
                   :w="element.w"
                   :h="element.h"
                   :i="element.i"
                   :minH="element.minH"
                   :minW="element.minW"
                   drag-allow-from=".title">
          <dynamic-widget v-bind="element"
                          :layoutMode="editMode"
                          :showHideButton="editMode"
                          :upDateTime="dateValue"
                          :selectMalls="selectedMalls"
                          v-on:delete-widget="userWidgets.splice(index, 1);"/>

        </grid-item>
      </grid-layout>
      <el-dialog
        v-if="addDialogVisible"
        :visible.sync="addDialogVisible"
        width="80%">
        <template>
          <div class="box">
            <el-row :gutter="24">
              <div v-for="(items,index) in unUsedWidget" :key="index">
                <el-col :span="6" v-for="item in items " :key="item.Id">
                  <div>
                    <label class="checkbox checkboxStyle">
                      <input v-model="item.Checked" type="checkbox">
                      <i class="fa fa-check-circle"></i>
                      <div class="text">
                        {{item.Name}}
                      </div>
                      <div class="iZoom">
                        <i class="fa fa-search-plus" @click="showWidget(item)"></i>
                      </div>
                    </label>
                  </div>
                </el-col>
              </div>
            </el-row>
          </div>
        </template>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="saveAddWidget()">{{$t('ok')}}</el-button>
          <el-button @click="addDialogVisible = false">{{$t('cancel')}}</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-if="showDialogVisible"
        :visible.sync="showDialogVisible"
        width="450px">
        <dynamic-widget style="width:300px;height:500px;margin: auto"
                        v-bind="showForm"
                        layoutMode></dynamic-widget>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import Moment from 'moment'
import {mapState} from 'vuex'
import DynamicWidget from '@/components/DynamicWidget'
import {GridLayout, GridItem} from 'vue-grid-layout'

export default {
  data () {
    return {
      editMode: false,

      dateValue: [Moment(new Date()).format('YYYY-MM-DD'), Moment(new Date()).format('YYYY-MM-DD')],
      pickerOptions: {
        shortcuts: [{
          text: this.$t('last_7_days'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('last_30_days'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      addDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'Name'
      },
      unUsedWidget: [],
      showDialogVisible: false,
      showForm: null
    }
  },
  methods: {
    showWidget (item) {
      this.showForm = item
      this.showDialogVisible = true
    },
    async addWidget () {
      let unUsedWidget = await this.$store.dispatch({type: 'widget/getUnUsedWidget'})
      unUsedWidget.forEach(el => {
        el.Name = this.$t(el.Title)
        el.Checked = false
      })
      this.unUsedWidget = []
      for (let i = 0, len = unUsedWidget.length; i < len; i += 4) {
        this.unUsedWidget.push(unUsedWidget.slice(i, i + 4))
      }
      this.addDialogVisible = true
    },
    saveAddWidget () {
      let maxY = _.max(this.userWidgets, el => el.y)
      _.each(this.unUsedWidget, (items) => {
        _.each(items, (el) => {
          if (el.Checked) {
            el.i = el.Id.toString()
            el.w = el.minW
            el.h = el.minH
            el.x = 0
            el.y = maxY.y + maxY.h
            this.userWidgets.push(el)
          }
        })
      })
      this.addDialogVisible = false
    },
    async saveWidget () {
      await this.$store.dispatch({type: 'widget/saveUserWidget'})
      await this.$store.dispatch({type: 'widget/getUserWidget'})
      this.editMode = false
    },
    async resetWidget () {
      await this.$store.dispatch({type: 'widget/resetUserWidget'})
    },
    async recoveryWidget () {
      await this.$store.dispatch({type: 'widget/getUserWidget'})
      this.editMode = false
    }
  },
  computed: {
    ...mapState('widget', {
      userWidgets: state => state.userWidgets
    }),
    ...mapState('app', {
      selectedMalls: state => state.selectedMalls
    })
  },
  components: {
    DynamicWidget,
    GridLayout,
    GridItem
  }
}
</script>

<style scoped>
  .context-page {
    display: flex;
    flex-direction: column;
  }

  .context-page > .header {
    flex: 0 0 auto;
    padding: 10px;
    border-bottom: 1px solid #eee;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .context-page > .header .title {
    font-size: 24px;
  }

  .context-page > .header .right {
    display: flex;
    flex-direction: row;
  }

  .context-page > .header .button {
    margin-left: 10px;
  }

</style>
