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
            <el-form-item :label="$t('Company')" prop="CompanyId">
              <el-select v-model.trim="modifyForm.CompanyId"
                         filterable
                         placeholder="...">
                <el-option v-for="item in companys"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('role_name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('role_description')"
                          prop="Description">
              <el-input v-model.trim="modifyForm.Description"></el-input>
            </el-form-item>
          </el-form>
          <el-tree :data="menuTree"
                   :props="defaultProps"
                   show-checkbox
                   node-key="Id"
                   ref="menuTree"
                   :default-checked-keys="menuSelect"></el-tree>
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

const defaultForm = () => {
  return {Id: '', CompanyId: '', Name: '', Description: ''}
}
export default {
  name: 'EditRole',
  data () {
    return {
      // form
      dialogVisible: false,
      modifyForm: defaultForm(),
      rules: {
        CompanyId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Name: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      },
      companys: [],
      // menu tree
      menuTree: [],
      menuSelect: [],
      defaultProps: {
        children: 'children',
        label: 'Name'
      }
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
      this.selectCompany()
      this.roleMenu(form ? form.Id : '')
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async roleMenu (roleId) {
      let rep = await this.$store.dispatch({type: 'role/roleMenu', data: {Id: roleId}})
      this.menuTree = rep.menuTree
      this.menuSelect = _.map(rep.menuSelect, function (it) {
        if (it.TreeShow === 1) {
          return it.MenuId
        }
      })
    },
    async selectCompany () {
      let rep = await this.$store.dispatch({type: 'company/selectCompany'})
      this.companys = rep
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // let menuIds = _.map(this.$refs.menuTree.getCheckedNodes(false, false), function (it) {
          //   return it.Id
          // })
          let aMenus = this.$refs.menuTree.getCheckedNodes(false, true)
          let menusMap = {}
          _.each(this.$refs.menuTree.getCheckedNodes(false, false), function (it) {
            menusMap[it.Id] = it.Id
          })
          let roleMenu = _.map(aMenus, function (it) {
            let v = menusMap[it.Id]
            let rm = {menuId: it.Id}
            if (v) {
              rm['TreeShow'] = 1
            } else {
              rm['TreeShow'] = 0
            }
            return rm
          })
          this.modifyForm['RoleMenu'] = roleMenu
          let rep = await this.$store.dispatch({type: 'role/saveOrUpdateRole', data: this.modifyForm})
          console.log(rep)
          this.dialogVisible = false
          this.$emit('handleQueryChange')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
