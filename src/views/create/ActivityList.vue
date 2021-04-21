<template>
  <div class="activity">
    <!-- 内容列表 -->
   <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
     <el-form-item label="活动名称：" prop="name">
       <article class="must-fix">必填</article>
       <el-input v-model="ruleForm.name" placeholder="例：10.15 地点 名称"></el-input>
     </el-form-item>
     <div class="separate" />
     <el-form-item label="限制最大邀请数" prop="cusLimit">
       <article class="must-fix">必填</article>
       <el-input v-model="ruleForm.cusLimit" placeholder="例：20，默认999"></el-input>
     </el-form-item>
     <div class="separate" />
     <el-form-item label="活动开始日期：" prop="startDate">
       <article class="must-fix">必填</article>
       <el-date-picker
         format="yyyy-MM-dd"
         value-format="yyyy-MM-dd"
         placeholder="选择活动开始日期"
         v-model="ruleForm.startDate"
         style="width: 100%;" />
     </el-form-item>
     <div class="separate" />
     <el-form-item label="活动截止日期：" prop="endDate">
       <article class="must-fix">必填</article>
       <el-date-picker
         format="yyyy-MM-dd"
         value-format="yyyy-MM-dd"
         placeholder="选择活动结束日期"
         v-model="ruleForm.endDate"
         style="width: 100%;" />
     </el-form-item>
     <div class="separate" />
     <el-form-item label="选择时间段(累计一天以上选择全天)：" prop="timeRange">
       <article class="must-fix">必填</article>
       <el-radio-group v-model="ruleForm.timeRange">
         <el-radio label="上午">上午</el-radio>
         <el-radio label="下午">下午</el-radio>
         <el-radio label="晚上">晚上</el-radio>
         <el-radio label="全天">全天</el-radio>
       </el-radio-group>
     </el-form-item>
     <div class="separate" />
     <el-form-item label="举办地点（酒店/职场/出游地/旅行地点）：" prop="location">
       <article class="must-fix">必填</article>
       <el-input v-model="ruleForm.location" placeholder="请填写具体地址，活动位置"></el-input>
     </el-form-item>
     <div class="separate" />
     <el-form-item label="活动描述：" prop="describe">
       <article class="must-fix">必填</article>
       <el-input type="textarea" rows="2" v-model="ruleForm.describe" placeholder="选填，若有额外活动描述，请填写"></el-input>
     </el-form-item>
     <div class="separate" />
     <div style="height: 60px"/>
   </el-form>
  </div>
</template>

<script>
import api from '@/plugins/api'
export default {
  name: 'ActivityList',
  props: {
    aid: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => []
    },
    create: {
      type: Boolean,
      default: false
    },
    update: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 获取已有的活动信息表
    getActivity () {
      if (this.data.length !== 0) {
        this.aid = this.data.aid
        this.ruleForm.name = this.data.act_name
        this.ruleForm.describe = this.data.act_dtl
        this.ruleForm.line = this.data.act_line
        this.ruleForm.cusLimit = this.data.max_num
        this.ruleForm.timeRange = this.data.ent_time
        this.ruleForm.location = this.data.act_place
        this.ruleForm.startDate = this.data.act_start_time.split(' ')[0]
        this.ruleForm.endDate = this.data.act_end_time.split(' ')[0]
        console.log('getActivityInfo:', this.ruleForm.name, this.ruleForm.line, this.ruleForm.cusLimit, this.ruleForm.describe, this.ruleForm.startDate, this.ruleForm.endDate)
      }
    },
    // 新增活动信息
    createActivity () {
      let aid = ''
      let uid = this.$store.state.currentUid
      let creator = this.$store.state.currentUserName
      let branch = this.$store.state.currentBranch
      let name = this.ruleForm.name
      let line = this.ruleForm.line
      let cusLimit = this.ruleForm.cusLimit
      let timeRange = this.ruleForm.timeRange
      let location = this.ruleForm.location
      let desc = this.ruleForm.describe
      let start = this.ruleForm.startDate
      let end = this.ruleForm.endDate
      let role = this.$store.state.currentRole
      let cFlag = 0
      console.log('createActivity:', aid, uid, creator, branch, name, line, cusLimit, timeRange, location, desc, start, end, role, cFlag)
      api._updActivity(aid, uid, creator, branch, name, line, cusLimit, timeRange, location, desc, start, end, role, cFlag).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('新增失败！')
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else if (Number(res.resultCode) === 1) {
          this.$message.success('新增成功')
          // 跳转到首页
          this.$router.push({path: '/', query: { uid: this.$store.state.currentUid }})
        } else {
          this.$message.error('resultCode:' + res.resultCode)
        }
      })
    },
    // 更新活动信息
    updateActivity () {
      let aid = this.aid
      let uid = this.$store.state.currentUid
      let creator = this.$store.state.currentUserName
      let branch = this.$store.state.currentBranch
      let name = this.ruleForm.name
      let line = this.ruleForm.line
      let cusLimit = this.ruleForm.cusLimit
      let timeRange = this.ruleForm.timeRange
      let location = this.ruleForm.location
      let desc = this.ruleForm.describe
      let start = this.ruleForm.startDate
      let end = this.ruleForm.endDate
      let role = this.$store.state.currentRole
      let cFlag = 1
      console.log('updateActivity:', aid, uid, creator, branch, name, line, cusLimit, timeRange, location, desc, start, end, role, cFlag)
      api._updActivity(aid, uid, creator, branch, name, line, cusLimit, timeRange, location, desc, start, end, role, cFlag).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('更新失败！')
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else if (Number(res.resultCode) === 2) {
          this.$message.success('更新成功')
          // 返回到上一页
          this.backClick()
        } else {
          this.$message.error('resultCode:' + res.resultCode)
        }
      })
    },
    // 提交新增
    submitCreate (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createActivity()
        } else {
          this.$message.error('验证未通过，提交失败！')
          return false
        }
      })
    },
    // 提交更新
    submitUpdate (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateActivity()
        } else {
          this.$message.error('验证未通过，提交失败！')
          return false
        }
      })
    },
    // 返回上级页面
    backClick () {
      this.$router.go(-1)
    }
  },
  data () {
    let checkEnd = (rule, value, callback) => {
      let startDate = this.ruleForm.startDate
      if (startDate === '') {
        callback(new Error('请先选择开始日期！'))
      }
      let start = new Date(startDate)
      let end = new Date(value)
      if ((start !== '') && (end < start)) {
        callback(new Error('结束日期不能小于开始日期！'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        name: '',
        line: '',
        cusLimit: 999,
        timeRange: '',
        location: '',
        describe: '',
        startDate: '',
        endDate: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        // cusLimit: [
        //   { required: true, message: '请输入限制人数', trigger: 'blur' }
        // ],
        timeRange: [
          { required: true, message: '请选择时间段', trigger: 'change' }
        ],
        location: [
          { required: true, message: '请填写举办地点', trigger: 'blur' }
        ],
        // describe: [
        //   { required: true, message: '请填写活动描述', trigger: 'blur' }
        // ],
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择截止日期', trigger: 'change' },
          { validator: checkEnd, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    let role = Number(this.$store.state.currentRole)
    if (role === 1) {
      this.ruleForm.line = '3'
    } else if (role === 2) {
      this.ruleForm.line = '2'
    } else if (role === 3) {
      this.ruleForm.line = '1'
    } else {
      console.log('role:', role)
      this.$message.error('权限获取错误')
    }
  },
  watch: {
    // 提交新的活动
    create (newVal, oldVal) {
      if (newVal) {
        this.submitCreate('ruleForm')
      }
    },
    // 更新活动
    update (newVal, oldVal) {
      if (newVal) {
        this.submitUpdate('ruleForm')
      }
    },
    // 获取活动内容
    data (newVal, oldVal) {
      if (newVal) {
        this.getActivity()
      }
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/form.styl"
  .activity
    form()
  .separate
    separate($margin: 2px)
  .must-fix
    must-fix()
</style>
