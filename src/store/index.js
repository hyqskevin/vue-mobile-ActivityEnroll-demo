import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const uid = ''
const leaderCode = ''
const leaderName = ''
const userCode = ''
const userName = ''
const userFlag = ''
const branchName = ''
const role = ''
const record = false
// 0：首页，1：我参与的页面，2：历史活动页面
const column = 0
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    currentUid: uid,
    currentLeaderCode: leaderCode,
    currentLeaderName: leaderName,
    currentUserCode: userCode,
    currentUserName: userName,
    currentFlag: userFlag,
    currentBranch: branchName,
    currentRole: role,
    currentRecord: record,
    updFlag: false,
    currentPageFlag: column
  },
  // 添加计算属性，依赖值改变时重新计算
  getters: {
    updFlag: state => state.updFlag
  },
  mutations: {
    // 提交载荷（Payload）
    getUserInfo (state, payload) {
      state.currentUid = payload.uid
      state.currentLeaderCode = payload.leaderCode
      state.currentLeaderName = payload.leaderName
      state.currentUserCode = payload.userCode
      state.currentUserName = payload.userName
      state.currentBranch = payload.branch
      state.currentRole = payload.role
      state.currentFlag = payload.flag
      // try {
      //   localStorage.userId = state.currentId
      //   localStorage.userName = state.currentName
      //   localStorage.tel = state.currentTel
      // } catch (e) {}
    },
    updateRecordFlag (state, payload) {
      state.currentRecord = payload.record
    },
    // 存储返回页面的flag
    pageReturnFlag (state, payload) {
      state.currentPageFlag = payload.column
    },
    updateApproveFlag (state, update) {
      state.updFlag = update
    },
    updateAssignFlag (state, update) {
      state.updFlag = update
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
