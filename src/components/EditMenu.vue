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
            <el-form-item :label="$t('menu_parentName')"
                          prop="ParentName">
              <el-input v-model.trim="parentName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="$t('menu_name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('menu_pageUrl')"
                          prop="PageUrl">
              <el-input v-model.trim="modifyForm.PageUrl"></el-input>
            </el-form-item>
            <el-form-item :label="$t('menu_rank')"
                          prop="Rank">
              <el-input v-model.trim="modifyForm.Rank"></el-input>
            </el-form-item>
            <el-form-item :label="$t('menu_description')"
                          prop="Description">
              <el-input v-model.trim="modifyForm.Description"></el-input>
            </el-form-item>
            <el-form-item :label="$t('menu_enabled')"
                          prop="Visible">
              <el-radio v-model="modifyForm.Visible" :label="1">{{$t('menu_show')}}</el-radio>
              <el-radio v-model="modifyForm.Visible" :label="-1">{{$t('menu_hide')}}</el-radio>
            </el-form-item>
          </el-form>
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
  return {ParentId: '', Name: '', PageUrl: '', Rank: 0, Description: '', Visible: 1}
}
export default {
  name: 'EditMenu',
  data () {
    return {
      dialogVisible: false,
      modifyForm: defaultForm(),
      parentName: '',
      rules: {
        Name: [
          {required: true, message: this.$t('please_enter_the_field_name'), trigger: 'blur'}
        ],
        PageUrl: [
          {required: true, message: this.$t('please_enter_the_field_name'), trigger: 'blur'}
        ],
        Rank: [
          {required: true, message: this.$t('please_enter_the_field_name'), trigger: 'blur'}
        ],
        Description: [
          {required: true, message: this.$t('please_enter_the_field_name'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
      if (form.ParentId) {
        this.selecMenutById(form.ParentId)
      }
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch({type: 'menu/saveOrUpdateMenu', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
          this.$emit('userMenuTree')
        } else {
          this.$message.error(this.$t('参数不正确'))
        }
      })
    },
    async selecMenutById (id) {
      let rep = await this.$store.dispatch({type: 'menu/selecMenutById', data: {id: id}})
      this.parentName = rep.Name
    }
  }
}
</script>

<style scoped>

</style>
