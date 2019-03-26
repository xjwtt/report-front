<template>
  <el-dialog title="案场"
             v-if="dialogVisible"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="50%">
    <el-transfer
      filterable
      :filter-method="filterMethod"
      filter-placeholder="..."
      v-model="selectMallsValue"
      :data="malls"
      :props="{ key: 'Id', label: 'Name', disable: false }"
      :titles="[$t('未选中'),$t('已选中')]">
    </el-transfer>
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
  name: 'RelatedMall',
  data () {
    return {
      dialogVisible: false,
      malls: [],
      businessTimeId: '',
      selectMallsValue: [],
      filterMethod (query, item) {
        return item.Name.indexOf(query) > -1
      }
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.selectCompanyMall(form.CompanyId)
      this.userMall(form.Id)
    },
    async selectCompanyMall (companyId) {
      let rep = await this.$store.dispatch({type: 'mall/selectCompanyMall', data: {CompanyId: companyId}})
      this.malls = rep
    },
    async userMall (businessTimeId) {
      this.businessTimeId = businessTimeId
      let rep = await this.$store.dispatch({type: 'mall/businessTimeMall', data: {businessTimeId: businessTimeId}})
      this.selectMallsValue = _.map(rep, _ => _.Id)
    },
    async submitForm () {
      await this.$store.dispatch({
        type: 'businesstime/businessTimeSaveMalls',
        data: {Id: this.businessTimeId, mallIds: this.selectMallsValue}
      })
      this.dialogVisible = false
      this.$emit('handleQueryChange')
    }
  }
}
</script>

<style scoped>

</style>
