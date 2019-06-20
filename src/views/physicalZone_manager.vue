<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('physicalZone_manager')}}</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="20">
          <span>{{$t('mall_name')}}:</span>
          <el-select v-model.trim="modifyForm.MallId"
                     filterable
                     placeholder="...">
            <el-option v-for="item in malls"
                       :key="item.Id"
                       :label="item.Name"
                       :value="item.Id">
            </el-option>
          </el-select>
          <span>{{$t('physical_name')}}:</span>
          <el-select v-model.trim="modifyForm.PhysicalZoneId"
                     filterable
                     placeholder="...">
            <el-option v-for="item in physicalZones"
                       :key="item.Id"
                       :label="item.Name"
                       :value="item.Id">
            </el-option>
          </el-select>
          <span>{{$t('camera_zone_name')}}:</span>
          <el-select v-model.trim="modifyForm.CameraZoneId"
                     filterable
                     placeholder="...">
            <el-option v-for="item in cameraZones"
                       :key="item.Id"
                       :label="item.Name"
                       :value="item.Id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('associated')" name="already">
              <el-button type="primary" @click="save">{{$t('save')}}</el-button>
              <datatable :columns="alreadyColumns"
                         :total='alreadyData.length'
                         :data="alreadyData"
                         :xprops="xprops"
                         :query="query"
                         :Pagination="false"
                         :HeaderSettings="false"
                         tblClass="table-bordered">
              </datatable>
            </el-tab-pane>
            <el-tab-pane :label="$t('not_associated')" name="isnot">
              <datatable :columns="isnotColumns"
                         :total='isnotData.length'
                         :data="isnotData"
                         :xprops="xprops"
                         :query="query"
                         :Pagination="false"
                         :HeaderSettings="false"
                         tblClass="table-bordered">
              </datatable>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'underscore'

const defaultForm = () => {
  return {
    MallId: '',
    PhysicalZoneId: '',
    CameraZoneId: ''
  }
}
export default {
  name: 'zoneCamera_manager',
  data () {
    return {
      modifyForm: defaultForm(),
      malls: [],
      physicalZones: [],
      cameraZones: [],
      activeName: 'already',
      query: {},
      physicalColums: [
        {title: 'device#zone', field: 'Name'},
        {title: 'zone_class', field: 'ZoneClass'},
        {title: 'direction', field: 'Reverse', tdComp: 'td-reverse'},
        {title: 'operation', tdComp: 'td-moveopt', visible: true}
      ],
      cameraZoneColums: [
        {title: 'name', field: 'Name'},
        {title: 'zone_type_name', field: 'ZoneTypeName', tdComp: 'td-i18n'},
        {title: 'direction', field: 'Reverse', tdComp: 'td-reverse'},
        {title: 'operation', tdComp: 'td-moveopt', visible: true}
      ],
      alreadyColumns: [],
      alreadyData: [],
      isnotColumns: [],
      isnotData: [],
      xprops: {
        eventbus: new Vue()
      }
    }
  },
  methods: {
    async selectCompanyMall () {
      let rep = await this.$store.dispatch({type: 'mall/selectCompanyMall'})
      this.malls = rep
      if (this.malls.length > 0) {
        this.modifyForm.MallId = this.malls[0].Id
      }
    },
    async selectPhysicalZone (mallId) {
      let rep = await this.$store.dispatch({type: 'zone/select', mallIds: [mallId]})
      this.physicalZones = rep
    },
    async selectCameraZone (mallId) {
      let rep = await this.$store.dispatch({type: 'cameraZone/selectCameraZoneCamera', data: {MallId: mallId}})
      _.each(rep, function (it) {
        it.Name = it.DeviceId + '#' + it.Zone
      })
      this.cameraZones = rep
    },
    async connectByPhysical () {
      await this.$store.dispatch({
        type: 'zonecamera/connectByPhysical',
        data: {PhysicalZoneId: this.modifyForm.PhysicalZoneId, CameraZoneCameras: this.alreadyData}
      })
      this.$message({
        message: 'save success',
        type: 'success'
      })
    },
    async connectByCameraZone () {
      await this.$store.dispatch({
        type: 'zonecamera/connectByCamera',
        data: {CameraZoneId: this.modifyForm.CameraZoneId, PhysicalZones: this.alreadyData}
      })
      this.$message({
        message: 'save success',
        type: 'success'
      })
    },
    async getCameraZone (mallId, searchId) {
      let rep = await this.$store.dispatch({
        type: 'zonecamera/getCameraZone',
        data: {MallId: mallId, SearchId: searchId}
      })
      _.each(rep.Search, function (it) {
        it.Name = it.DeviceId + '#' + it.Zone
      })
      _.each(rep.All, function (it) {
        it.Name = it.DeviceId + '#' + it.Zone
      })
      this.alreadyData = rep.Search
      this.isnotData = rep.All
    },
    async getPhysicalByCamera (mallId, searchId) {
      let rep = await this.$store.dispatch({
        type: 'zonecamera/getPhysicalByCamera',
        data: {MallId: mallId, SearchId: searchId, Enable: 1}
      })
      this.alreadyData = rep.Search
      this.isnotData = rep.All
    },
    async move (row) {
      row.Reverse = row.Reverse >= 0 ? 1 : -1
      switch (this.activeName) {
        case 'already':
          this.alreadyData = _.filter(this.alreadyData, function (item) {
            return item.Id !== row.Id
          })
          this.isnotData.push(row)
          break
        case 'isnot':
          this.isnotData = _.filter(this.isnotData, function (item) {
            return item.Id !== row.Id
          })
          this.alreadyData.push(row)
          break
      }
    },
    async reverse (row, reverse) {
      row.Reverse = reverse
    },
    async save () {
      if (this.modifyForm.PhysicalZoneId !== '') {
        this.connectByPhysical()
      } else {
        this.connectByCameraZone()
      }
    }
  },
  mounted () {
    this.selectCompanyMall()
    this.xprops.eventbus
      .$on('MOVE', this.move)
      .$on('REVERSE', this.reverse)
  },
  watch: {
    'modifyForm.MallId':
      {
        handler: function (newValue, OldValue) {
          this.modifyForm.PhysicalZoneId = ''
          this.modifyForm.CameraZoneId = ''
          this.selectPhysicalZone(newValue)
          this.selectCameraZone(newValue)
        },
        deep: true
      },
    'modifyForm.PhysicalZoneId':
      {
        handler: function (newValue, OldValue) {
          if (newValue !== '') {
            this.modifyForm.CameraZoneId = ''
            this.alreadyColumns = this.physicalColums
            this.isnotColumns = this.physicalColums
            this.getCameraZone(this.modifyForm.MallId, newValue)
          }
        },
        deep: true
      },
    'modifyForm.CameraZoneId':
      {
        handler: function (newValue, OldValue) {
          if (newValue !== '') {
            this.modifyForm.PhysicalZoneId = ''
            this.alreadyColumns = this.cameraZoneColums
            this.isnotColumns = this.cameraZoneColums
            this.getPhysicalByCamera(this.modifyForm.MallId, newValue)
          }
        },
        deep: true
      }
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
  }
</style>
