<template>
  <div>
    <div>
      <el-button type="primary" plain @click="goBack()">{{$t('go_back')}}</el-button>
    </div>
    <div style="margin: 0 auto;width: 941px">
      <el-table
        :data="company"
        border>
        <el-table-column
          prop="Name"
          width="180"
          :label="$t('company_name')">
        </el-table-column>
        <el-table-column
          prop="CompanyAddress"
          width="260"
          :label="$t('company_address')">
        </el-table-column>
        <el-table-column
          prop="Principal"
          width="160"
          :label="$t('principal')">
        </el-table-column>
        <el-table-column
          prop="PrincipalTEll"
          width="140"
          :label="$t('principal_tell')">
        </el-table-column>
        <el-table-column
          prop="PrincipalMail"
          width="200"
          :label="$t('principal_mail')">
        </el-table-column>
      </el-table>
    </div>
    <div>
      <the-table :fields=tableHeader
                 :data=this.malls
                 :maxHeight="500"
                 :export-name="'site_info'"></the-table>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  props: {
    company: {
      type: Array
    },
    malls: {
      type: Array
    },
    cameraDeviceTypes: {
      type: Array
    }
  },
  computed: {
    tableHeader () {
      let headers = [{
        width: 200,
        prop: 'MallCode',
        fixed: true,
        label: this.$t('mall_code'),
        sortable: false,
        formatter: (row, col) => row['MallCode']
      }, {
        width: 200,
        prop: 'Name',
        fixed: true,
        label: this.$t('mall_name'),
        sortable: false,
        formatter: (row, col) => row['Name']
      }, {
        width: 260,
        prop: 'Address',
        label: this.$t('address'),
        sortable: false,
        formatter: (row, col) => row['Address']
      }, {
        width: 160,
        prop: 'Principal',
        label: this.$t('principal'),
        sortable: false,
        formatter: (row, col) => row['Principal']
      }, {
        width: 140,
        prop: 'PrincipalTEll',
        label: this.$t('principal_tell'),
        sortable: false,
        formatter: (row, col) => row['PrincipalTEll']
      }, {
        width: 200,
        prop: 'PrincipalMail',
        label: this.$t('principal_mail'),
        sortable: false,
        formatter: (row, col) => row['PrincipalMail']
      }, {
        width: 160,
        prop: 'CreateTime',
        label: this.$t('create_time'),
        sortable: false,
        formatter: (row, col) => row['CreateTime']
      }, {
        width: 120,
        prop: 'ContractStartDate',
        label: this.$t('contract_start_date'),
        sortable: false,
        formatter: (row, col) => row['ContractStartDate']
      }, {
        width: 120,
        prop: 'ContractEndDate',
        label: this.$t('contract_end_date'),
        sortable: false,
        formatter: (row, col) => row['ContractEndDate']
      }]
      _.each(this.cameraDeviceTypes, (v) => {
        headers.push({
          width: 100,
          prop: v.Data,
          label: v.Data,
          sortable: false,
          formatter: (row, col) => row[v.Data]
        })
      })
      return headers
    }
  },
  methods: {
    goBack () {
      this.$emit('goBack')
    }
  }

}
</script>

<style scoped>

</style>
