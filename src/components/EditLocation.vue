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
            <el-form-item :label="$t('parent_name')"
                          prop="ParentName">
              <el-input v-model.trim="parentName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="$t('name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ranked')"
                          prop="Rank">
              <el-input-number v-model.trim="modifyForm.Ranked"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('get_weather')"
                          prop="GetWeather">
              <el-radio v-model="modifyForm.GetWeather" :label="1">{{$t('acquire')}}</el-radio>
              <el-radio v-model="modifyForm.GetWeather" :label="-1">{{$t('not_acquire')}}</el-radio>
            </el-form-item>
          </el-form>
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
const defaultForm = () => {
  return {ParentId: '', Name: '', Ranked: 0, GetWeather: -1}
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
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Ranked: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
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
        this.selectLocationById(form.ParentId)
      }
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch({type: 'location/saveOrUpdateLocation', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
          this.$emit('loadLocationTree')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    },
    async selectLocationById (id) {
      let rep = await this.$store.dispatch({type: 'location/selectLocationById', data: {id: id}})
      this.parentName = rep.Name
    }
  }
}
</script>

<style scoped>

</style>
