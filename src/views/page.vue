<template>
  <div class="page">
    <div class="header">
      <div class="left">
        <span class="title">{{$t("iretailer_business_analysis")}}</span>
        <nav-menu :menus="menus"></nav-menu>
      </div>
      <div>
        <span class="site-region"
              @click="SiteRegionShow=!SiteRegionShow">{{selectedMalls.length}}/{{malls.length}}{{$t("sites")}}
          <i :class="{'el-icon-arrow-down': !SiteRegionShow, 'el-icon-arrow-up': SiteRegionShow }"></i>
        </span>
        <el-dialog :visible.sync="SiteRegionShow">
          <el-transfer filterable
                       :filter-method="filterMethod"
                       filter-placeholder="..."
                       v-model="selectMallsValue"
                       @change="selectedMallsChange"
                       :data="malls"
                       :props="{ key: 'Id', label: 'Name', disable: false }"
                       :titles="[$t('未选中'),$t('已选中')]">

          </el-transfer>

        </el-dialog>
        <el-dropdown class="user"
                     trigger="click"
                     @command="handleCommand">
          <span class="el-dropdown-link">
            {{userName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">{{$t("log_off")}}</el-dropdown-item>
            <el-dropdown-item command="modifyPassword">{{$t("modify_password")}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </div>
    <div class="content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import NavMenu from '../components/NavMenu'
import _ from 'underscore'
export default {
  data () {
    return {
      selectMallsValue: null,
      SiteRegionShow: false,
      filterMethod (query, item) {
        return item.Name.indexOf(query) > -1
      }
    }
  },
  methods: {
    ...mapMutations('app', ['setSelectMalls']),
    async handleCommand (command) {
      if (command === 'logout') {
        await this.$store.dispatch({
          type: 'app/logout'
        })
      }
    },
    selectedMallsChange () {
      this.setSelectMalls(this.selectMallsValue)
    }
  },
  computed: {
    ...mapState('app', {
      userName: state => state.userName,
      menus: state => state.menus,
      malls: state => state.malls,
      selectedMalls: state => state.selectedMalls
    })
  },
  components: {
    NavMenu
  },
  created () {
    this.selectMallsValue = _.map(this.selectedMalls, _ => _.Id)
  },
  activated () {
    this.selectMallsValue = _.map(this.selectedMalls, _ => _.Id)
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
</style>
