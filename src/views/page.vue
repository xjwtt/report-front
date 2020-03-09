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
         <span style="color:#acacac;margin-right: 10px"
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
        <el-dropdown class="user" trigger="click" @command="changeLanguage">
            <span class="el-dropdown-link" style="color:#acacac;margin-right: 10px">
              Language
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in languageTypes"
              :key="item.KeyName"
              :command="item.KeyName">
              {{item.Name}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
  return 'data:image/png;base64,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N////5n/AP8A/wH/AP8A/wD/df9Y/wD/AP8A/wD/AP/C/67/AP8h/57/Kv8A/1f///9k/wD/AP8C/xP/D/8M/wn/AP8r/xT/Gv8a/zD/Ev8O/wD/Kv8i/wD/Gf8y/wL/I/8n/w//Df8P/yr/Fv8Q/wz/Df8R/zT/Av8m/yD/EP8D/wb/E/8A/xj/D/8M/xP/Lf8T/wf/gP8b/xX/I/8H/yv/I/8u/wUA/wD/AP8A/wD/AP8D/zv/GP8A/wD/AP9U/2X/AP8A/wD/I/9w/w3/AP8A/zb/L/8A/0b///9P/wD/Pv/W/0n/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/Af8V/wH/AP8A/wD/AP8A/wD/AAD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/8X/5/8J/wD/AP9d////Mf8A/wD/AP8A/wD/A/8c/wT/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8AAP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/I/8t/wD/AP8A/wj/Jf8A/w3/rP9p/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wAA/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/Hf/1/6P/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AAEAAP//O1PidKoVI6cAAAAASUVORK5CYII='
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
          // await this.$store.dispatch({type: 'app/getUserInfo', data: this.loginForm})
          location.reload()
          this.$message.success(this.$t('success'))
        }
      })
    },
    async changeLanguage (command) {
      let appState = this.$store.state.app
      let post = {Language: appState.language, Email: appState.email, Telephone: appState.telephone}
      if (command && command !== appState.language) {
        post.Language = command
        await this.$store.dispatch({type: 'user/userSetting', data: post})
        location.reload()
      }
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
      let rep = await this.$store.dispatch({
        type: 'category/selectCategoryByKeyName',
        data: {KeyName: 'LanguageType'}
      })
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
    this.selectCategoryByKeyName()
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
