import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home'
import Activity from '../views/create/Activity'
import Gather from '../views/gather/Gather'
import Detail from '../views/detail/Detail'
import RecordDetail from '../views/record/detail/RecordDetail'
import Entry from '../views/entry/Entry'
import ErrorPage from '../components/ErrorPage.vue'
import Record from '../views/record/Record'
import MyRecord from '../views/myRecord/MyRecord'
import Rank from '../views/rank/Rank'
import UserInfo from '../views/user/UserInfo'
import Loading from '../components/Loading'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/activity',
    name: 'activity',
    component: Activity,
    meta: { title: '活动表单' }
  },
  {
    path: '/detail',
    name: 'detail',
    component: Detail,
    meta: { title: '活动详情' }
  },
  {
    path: '/history_detail',
    name: 'historyDetail',
    component: RecordDetail,
    meta: { title: '历史活动详情' }
  },
  {
    path: '/entry',
    name: 'entry',
    component: Entry,
    meta: { title: '报名表单' }
  },
  {
    path: '/gather',
    name: 'gather',
    component: Gather,
    meta: { title: '汇总信息表单' }
  },
  {
    path: '/record',
    name: 'record',
    component: Record,
    meta: { title: '查看历史记录' }
  },
  {
    path: '/my_record',
    name: 'MyRecord',
    component: MyRecord,
    meta: { title: '我的历史记录' }
  },
  {
    path: '/rank',
    name: 'rank',
    component: Rank,
    meta: { title: '查看排名' }

  },
  {
    path: '/user',
    name: 'userInfo',
    component: UserInfo,
    meta: { title: '查看个人信息' }
  },
  {
    path: '/404',
    name: 'page404',
    component: ErrorPage
  },
  {
    path: '/loading',
    name: 'loading',
    component: Loading
  },
  {
    path: '*',
    redirect: '/loading',
    hidden: true
  }
]

const router = new VueRouter({
  routes
})

export default router
