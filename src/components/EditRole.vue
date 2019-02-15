<template>
  <el-dialog title="编辑"
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
            <el-form-item :label="$t('role_name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('role_description')"
                          prop="Description">
              <el-input v-model.trim="modifyForm.Description"></el-input>
            </el-form-item>
          </el-form>
          <el-tree :data="menuTree" :props="defaultProps" show-checkbox></el-tree>
        </el-col>
      </el-row>
    </template>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="submitForm('modifyForm')">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
const defaultForm = () => {
  return {Name: '', Description: ''}
}
export default {
  name: 'EditRole',
  data () {
    return {
      // form
      dialogVisible: false,
      modifyForm: defaultForm(),
      rules: {
        Name: [
          {required: true, message: this.$t('please_enter_the_field_name'), trigger: 'blur'}
        ]
      },
      // menu tree
      menuTree: [],
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
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
        } else {
          this.$message.error(this.$t('参数不正确'))
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
