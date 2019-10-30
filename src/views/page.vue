<template xmlns:el-col="http://www.w3.org/1999/html">
  <div class="page">
    <div class="header">
      <div class="left">
        <div class="logoDiv">
          <img :src="showLogo&&showLogo.indexOf('data:')>=0?showLogo:defaultShowLogo">
        </div>
        <nav-menu :menus="menus"></nav-menu>
      </div>
      <div>
         <span style="color:#acacac"
               @click="siteRegionShow()">{{selectedMalls.length}}/{{malls.length}} {{$t('site')}}
          <i :class="{'el-icon-arrow-down': !SiteRegionShow, 'el-icon-arrow-up': SiteRegionShow }"></i>
        </span>
        <el-dialog
          v-if="SiteRegionShow"
          :visible.sync="SiteRegionShow"
          :show-close="false"
          width="80%"
          height="600px">
          <el-card>
            <div slot="header" class="clearfix">
              <el-col :gutter="24">
                <el-col :span="4">
                  <div class="input-group input-group-sm">
                    <input type="search"
                           class="form-control"
                           ref="input"
                           v-model="keyword"
                           @keydown.enter="search"
                           :placeholder="`...`">
                    <span class="input-group-btn">
                          <button class="btn btn-default fa fa-search"
                                  @click="search"></button>
                      </span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <el-select
                    size="small"
                    v-model="tagSelect"
                    multiple
                    collapse-tags
                    style="margin-left: 20px;"
                    @change="tagSelectChange"
                    :placeholder="$t('fast_tag_Selection')">
                    <el-option
                      v-for="item in tagTypes"
                      :key="item.Id"
                      :label="item.Name"
                      :value="item.Id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <div style="margin-left: 20px;margin-top: -5px;">
                    <label class="checkbox">
                      <input v-model="AllChecked" type="checkbox" @click="AllCheckedOrNot">
                      <i class="fa fa-check-circle"></i>
                      <div class="text">
                        {{$t('all_election')}}
                      </div>
                    </label>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div style="width: 100%;text-align: right;margin-top: 5px">
                  <span>
                    {{selectShowMalls.length}}/{{showMalls.length}} {{$t('site')}}
                  </span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="width: 100%;text-align: right">
                    <el-button type="primary"
                               @click="selectedMallsChange()">{{$t('ok')}}
                    </el-button>
                    <el-button @click="SiteRegionShow = false">{{$t('cancel')}}</el-button>
                  </div>
                </el-col>
              </el-col>
            </div>
            <div class="box">
              <div v-for="(item,index) in showMalls" :key="index">
                <el-col :span="7" style="margin-left: 3%">
                  <div>
                    <label class="checkbox checkboxStyle">
                      <input v-model="item.Checked" type="checkbox">
                      <i class="fa fa-check-circle"></i>
                      <div class="text">
                        {{item.Name}}
                      </div>
                    </label>
                  </div>
                </el-col>
              </div>
            </div>
          </el-card>
        </el-dialog>
        <el-dropdown class="user"
                     trigger="click"
                     @command="handleCommand">
          <span class="el-dropdown-link" style="color:#acacac">
            {{userName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userSetting">{{$t('user_setting')}}</el-dropdown-item>
            <el-dropdown-item command="modifyPassword">{{$t('modify_password')}}</el-dropdown-item>
            <el-dropdown-item command="logout">{{$t('log_out')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-dialog :title="$t('prompt')"
                 :visible.sync="logOutDialogVisible"
                 width="30%">
        <span>{{$t('will_quit_system')}}</span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="logOutDialogVisible = false">{{$t('cancel')}}</el-button>
          <el-button type="primary"
                     @click="sureLogOut">{{$t('ok')}}</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="settingDialogVisible">
        <template>
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form :model="settingModifyForm"
                       ref=settingModifyForm
                       label-width="150px"
                       class="demo-modifyForm">
                <el-form-item :label="$t('language')"
                              prop="Language">
                  <el-select v-model.trim="settingModifyForm.Language">
                    <el-option v-for="item in languageTypes"
                               :key="item.Id"
                               :label="item.Name"
                               :value="item.KeyName">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('user_email')"
                              prop="Email">
                  <el-input v-model.trim="settingModifyForm.Email"></el-input>
                </el-form-item>
                <el-form-item :label="$t('user_telephone')"
                              prop="Telephone">
                  <el-input v-model.trim="settingModifyForm.Telephone"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </template>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="settingDialogVisible = false">{{$t('cancel')}}</el-button>
          <el-button type="primary"
                     @click="sureUserSetting('settingModifyForm')">{{$t('ok')}}</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="passDialogVisible">
        <template>
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form :model="passModifyForm"
                       :rules="passRules"
                       ref=passModifyForm
                       label-width="150px"
                       class="demo-modifyForm">
                <el-form-item :label="$t('old_password')"
                              prop="OldPassword">
                  <el-input type="password" v-model.trim="passModifyForm.OldPassword"></el-input>
                </el-form-item>
                <el-form-item :label="$t('user_password')"
                              prop="UserPwd">
                  <el-input type="password" v-model.trim="passModifyForm.UserPwd"></el-input>
                </el-form-item>
                <el-form-item :label="$t('user_conpassword')"
                              prop="conUserPwd">
                  <el-input type="password" v-model.trim="passModifyForm.conUserPwd"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </template>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="passDialogVisible = false">{{$t('cancel')}}</el-button>
          <el-button type="primary"
                     @click="sureChangePwd('passModifyForm')">{{$t('ok')}}</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import NavMenu from '../components/NavMenu'
import _ from 'underscore'
import fuzzysort from 'fuzzysort'

const iretailerLogo = () => {
  return 'data:image/jpeg;base64,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ZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTAtMzBUMTM6MjU6MzUrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEwLTMwVDE0OjMzOjU3KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEwLTMwVDE0OjMzOjU3KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGRURCRDZEQTBGMjA2ODExODA4Mzg5RjI2QjAxMEFBNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGRERCRDZEQTBGMjA2ODExODA4Mzg5RjI2QjAxMEFBNyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkZEREJENkRBMEYyMDY4MTE4MDgzODlGMjZCMDEwQUE3Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRERCRDZEQTBGMjA2ODExODA4Mzg5RjI2QjAxMEFBNyIgc3RFdnQ6d2hlbj0iMjAxOS0xMC0zMFQxMzoyNTozNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3BuZyB0byBpbWFnZS9qcGVnIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRURCRDZEQTBGMjA2ODExODA4Mzg5RjI2QjAxMEFBNyIgc3RFdnQ6d2hlbj0iMjAxOS0xMC0zMFQxNDozMzo1NyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iDFhJQ0NfUFJPRklMRQABAQAADEhMaW5vAhAAAG1udHJSR0IgWFlaIAfOAAIACQAGADEAAGFjc3BNU0ZUAAAAAElFQyBzUkdCAAAAAAAAAAAAAAAAAAD21gABAAAAANMtSFAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWNwcnQAAAFQAAAAM2Rlc2MAAAGEAAAAbHd0cHQAAAHwAAAAFGJrcHQAAAIEAAAAFHJYWVoAAAIYAAAAFGdYWVoAAAIsAAAAFGJYWVoAAAJAAAAAFGRt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'
}
const defulatPassModifyForm = () => {
  return {
    OldPassword: '',
    UserPwd: '',
    conUserPwd: ''
  }
}
export default {
  data () {
    return {
      defaultShowLogo: iretailerLogo(),
      selectMallsValue: null,
      SiteRegionShow: false,
      logOutDialogVisible: false,
      passDialogVisible: false,
      passModifyForm: defulatPassModifyForm(),
      settingDialogVisible: false,
      settingModifyForm: {Language: 'auto', Email: '', Telephone: ''},
      languageTypes: [],
      showMalls: [],
      selectShowMalls: [],
      AllChecked: false,
      keyword: null,
      tagSelect: [],
      filterMethod (query, item) {
        return item.Name.indexOf(query) > -1
      },
      passRules: {
        OldPassword: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        UserPwd: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        conUserPwd: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    ...mapMutations('app', ['setSelectMalls']),
    siteRegionShow () {
      this.initSelectMalls()
      this.SiteRegionShow = !this.SiteRegionShow
    },
    async handleCommand (command) {
      switch (command) {
        case 'logout':
          this.logOutDialogVisible = true
          break
        case 'userSetting':
          this.selectCategoryByKeyName()
          let appState = this.$store.state.app
          this.settingModifyForm.Language = appState.language
          this.settingModifyForm.Email = appState.email
          this.settingModifyForm.Telephone = appState.telephone
          this.settingDialogVisible = true
          break
        case 'modifyPassword':
          this.passDialogVisible = true
          break
      }
    },
    selectedMallsChange () {
      if (this.selectShowMalls.length === 0) {
        this.$message.error(this.$t('hava_to_choose_a_site'))
      } else {
        this.setSelectMalls(this.selectShowMalls)
        this.SiteRegionShow = false
        this.keyword = ''
      }
    },
    async sureLogOut () {
      await this.$store.dispatch({
        type: 'app/logout'
      })
    },
    sureUserSetting (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch({type: 'user/userSetting', data: this.settingModifyForm})
          this.settingDialogVisible = false
          await this.$store.dispatch({type: 'app/getUserInfo', data: this.loginForm})
          this.$message.success(this.$t('success'))
        }
      })
    },
    sureChangePwd (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.passModifyForm.conUserPwd && (this.passModifyForm.UserPwd !== this.passModifyForm.conUserPwd)) {
            this.$message.error(this.$t('two_passwords_are_different'))
          } else {
            await this.$store.dispatch({
              type: 'user/changePassword',
              data: this.passModifyForm
            })
            this.passDialogVisible = false
            this.$message.success(this.$t('success'))
          }
        }
      })
    },
    async selectCategoryByKeyName () {
      let rep = await this.$store.dispatch({type: 'category/selectCategoryByKeyName', data: {KeyName: 'LanguageType'}})
      _.each(rep, (v) => {
        v.Name = this.$t(v.Name)
      })
      this.languageTypes = rep
    },
    search () {
      let result = fuzzysort.go(this.keyword, this.malls, {key: 'Name'})
      if (result.length > 0) {
        let temp = []
        let resultMap = {}
        _.each(result, (v) => {
          let obj = v.obj
          resultMap[obj.Id] = obj
          temp.push(obj)
        })
        _.each(this.showMalls, (v) => {
          let find = resultMap[v.Id]
          if (!find) {
            temp.push(v)
          }
        })
        document.getElementsByClassName('box')[0].scrollTop = 0
        this.showMalls = temp
      }
    },
    AllCheckedOrNot () {
      _.each(this.malls, (_) => {
        _.Checked = !this.AllChecked
      })
    },
    computedAllChecked () {
      let checkedLen = 0
      _.each(this.showMalls, function (v) {
        if (v.Checked) {
          checkedLen += 1
        }
      })
      this.AllChecked = (this.malls.length === checkedLen)
    },
    initSelectMalls () {
      let that = this
      that.showMalls = this.malls
      let selectMallsValue = _.map(this.selectedMalls, _ => _.Id)
      let mapSelectedMalls = _.object(selectMallsValue, selectMallsValue)
      _.each(that.showMalls, function (v) {
        let selected = mapSelectedMalls[v.Id]
        if (selected) {
          that.$set(v, 'Checked', true)
        } else {
          that.$set(v, 'Checked', false)
        }
      })
    },
    computedSelectShowMalls () {
      let selected = []
      _.each(this.showMalls, function (v) {
        if (v.Checked) {
          selected.push(v.Id)
        }
      })
      if (selected.length === 0) {
        this.$message.error(this.$t('hava_to_choose_a_site'))
      }
      this.selectShowMalls = selected
    },
    tagSelectChange () {
      let that = this
      _.each(that.showMalls, (v) => {
        v.Checked = false
      })
      let mallIds = []
      _.each(that.tagSelect, (v) => {
        _.each(that.tagTypes, (t) => {
          if (v === t.Id) {
            mallIds = mallIds.concat(t.MallIds)
          }
        })
      })
      let mallIdSet = new Set(mallIds)
      for (let id of mallIdSet) {
        for (let m of that.showMalls) {
          if (id === m.Id) {
            m.Checked = true
            break
          }
        }
      }
    },
    computedTagSelect () {
      let that = this
      that.tagSelect = []
      let mallIdObject = _.object(this.selectShowMalls, this.selectShowMalls)
      _.each(this.tagTypes, (t) => {
        let ids = t.MallIds
        let i = 0
        _.each(ids, (id) => {
          let find = mallIdObject[id]
          if (find) {
            i += 1
          }
        })
        if (i === ids.length) {
          that.tagSelect.push(t.Id)
        }
      })
    }
  },
  computed: {
    ...mapState('app', {
      showLogo: state => state.showLogo,
      userName: state => state.userName,
      menus: state => state.menus,
      malls: state => state.malls,
      selectedMalls: state => state.selectedMalls,
      tagTypes: state => state.tagTypes
    })
  },
  components: {
    NavMenu
  },
  watch: {
    showMalls: {
      handler () {
        this.computedAllChecked()
        this.computedSelectShowMalls()
        this.computedTagSelect()
      },
      deep: true
    },
    keyword: {
      handler () {
        this.search()
      },
      deep: true
    }
  },
  mounted () {
    this.initSelectMalls()
  }
}
</script>

<style>
  .page {
    min-width: 1024px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .page > .header {
    flex: 60px 0 0;
    background-color: #324157;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .page > .header > .left {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .page > .header .title {
    padding-left: 15px;
    padding-right: 15px;
    color: white;
    font-weight: 700;
    font-size: 20px;
  }

  .page > .content {
    flex: auto;
    display: flex;
    flex-direction: column;
  }

  .report-page {
    padding: 15px 15px;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }

  .report-page-card {
    margin: 10px;
    padding: 15px 30px;
    flex: 0 0 auto;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-shadow: 0 0 5px #ccc;
  }

  .config-page {
    padding: 10px;
    flex-direction: column;
  }

  .config-page > .title {
    display: flex;
    flex-flow: row-reverse;
  }

  .logoDiv {
    margin-left: 10px;
    margin-right: 10px;
  }

  .logoImage {
    height: 40px;
    width: 120px
  }

  /** 日期选择 快捷键宽度 **/
  .el-picker-panel [slot=sidebar], .el-picker-panel__sidebar {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 126px;
    border-right: 1px solid #e4e4e4;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 6px;
    background-color: #fff;
    overflow: auto;
  }

  .box {
    max-height: 350px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .checkboxStyle {
    line-height: 40px;
    padding: 8px 4px 8px 24px;
    border: 1px solid #eee;
  }

  .checkbox input[type=checkbox] {
    display: none;
  }

  .checkbox .fa {
    margin-right: 10px;
    font-size: 24px;
    line-height: 1;
    color: #cdcdcd;
    vertical-align: middle;
  }

  .checkbox input[type=checkbox]:checked + .fa {
    color: #689AE4;
  }

  .checkbox .text {
    display: inline-block;
    vertical-align: middle;
    -moz-user-select: none;
  }

  .checkbox .iZoom {
    font-size: 24px;
    float: right;
  }
</style>
