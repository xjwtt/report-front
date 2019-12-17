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
    <the-table :fields=tableHeader
               :data=this.users
               :maxHeight="500"
               :export-name="'userInfoTable'"></the-table>
  </div>
</template>

<script>
export default {
  props: {
    company: {
      type: Array
    },
    users: {
      type: Array
    }
  },
  computed: {
    tableHeader () {
      let headers = [{
        width: 160,
        prop: 'UserCode',
        label: this.$t('user_code'),
        sortable: false,
        formatter: (row, col) => row['UserCode']
      }, {
        width: 160,
        prop: 'RoleName',
        label: this.$t('role_name'),
        sortable: false,
        formatter: (row, col) => row['RoleName']
      }, {
        width: 160,
        prop: 'Name',
        label: this.$t('user_name'),
        sortable: false,
        formatter: (row, col) => row['Name']
      }, {
        width: 100,
        prop: 'MallNumber',
        label: this.$t('mall_number'),
        sortable: false,
        formatter: (row, col) => row['MallNumber']
      }]
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
