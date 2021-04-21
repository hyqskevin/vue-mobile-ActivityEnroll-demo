<template>
  <div class="entry">
    <!-- 内容列表 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100%">
      <el-form-item label="活动开始日期(系统默认)：" prop="startDate">
        <article class="must-fix">必填</article>
        <el-date-picker
          disabled
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="ruleForm.startDate"
          style="width: 100%;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动结束日期(系统默认)：" prop="startDate">
        <el-date-picker
          disabled
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="ruleForm.endDate"
          style="width: 100%;">
        </el-date-picker>
      </el-form-item>
      <div class="entry-separate" />
      <el-form-item label="选择时间段(系统默认)：" prop="timeRange">
        <article class="must-fix">必填</article>
        <el-radio-group v-model="ruleForm.timeRange">
          <el-radio label="上午">上午</el-radio>
          <el-radio label="下午">下午</el-radio>
          <el-radio label="晚上">晚上</el-radio>
          <el-radio label="全天">全天</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="entry-separate" />
      <el-form-item label="举办地点（酒店/职场/出游地/旅行地点）：" prop="location">
        <article class="must-fix">必填</article>
        <el-input v-model="ruleForm.location" placeholder="请填写举办地点"></el-input>
      </el-form-item>
      <div class="entry-separate" />
      <el-form-item label="用户数：" prop="customerNum">
        <article class="must-fix">必填</article>
        <el-input v-model="ruleForm.customerNum" placeholder="请填写用户数"></el-input>
      </el-form-item>
      <div class="entry-separate" />
      <p/>
    </el-form>
    <p/>
    <div :key="index" v-for="(list, index) in customerForm.appInfo">
      <el-form :model="list" :rules="rules" ref="customerForm" label-width="100px">
        <el-form-item  label="姓名：" prop="cus_name">
          <el-input v-model="list.cus_name" size="mini" class="input-customer-info"></el-input>
        </el-form-item>
        <el-form-item  label="年龄：" prop="cus_age">
          <el-input v-model="list.cus_age" size="mini" class="input-customer-info"></el-input>
        </el-form-item>
        <el-form-item  label="联系方式：" prop="cus_tel">
          <el-input v-model="list.cus_tel" size="mini" class="input-customer-info"></el-input>
        </el-form-item>
        <el-button icon="el-icon-delete" @click.prevent="removeCustomer(list)" class="delete-customer-info"></el-button>
        <p/>
        <div class="entry-separate" />
        <p/>
      </el-form>
    </div>
    <div style="height: 20px"/>
    <div class="entry-button">
      <el-button v-prevent-re-click @click="addCustomer" class="button">新增用户</el-button>
<!--      <el-button type="primary" @click="save('ruleForm')" class="button">保存报名</el-button>-->
      <el-button v-prevent-re-click type="success" @click="submit('ruleForm')" class="button">提交报名</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/api'
import idValidate from '@/plugins/validate'
// import _select from '../../components/selectBranchList'
export default {
  name: 'EntryList',
  props: {
    aid: {
      type: Number,
      default: 0
    },
    update: {
      type: Number,
      default: 0
    },
    start: '',
    end: '',
    dateRange: '',
    timeRange: '',
    location: '',
    data: {
      type: Array,
      default: () => {}
    }
  },
  methods: {
    // 读取客户信息
    getEntry () {
      let length = Object.keys(this.data).length
      console.log('length', length)
      console.log('getEntryData:', this.data)
      if (length !== 0) {
        this.ruleForm.teamLeader = this.data.act_creater
        this.ruleForm.branch = this.data.branch
        // this.ruleForm.date = this.date
        this.ruleForm.timeRange = this.timeRange
        this.ruleForm.location = this.location
        this.ruleForm.customerNum = Number(this.data.single_cus_sum)
        this.customerForm.appInfo = this.data.applInfo
        console.log('getEntryInfo:', this.ruleForm.date, this.ruleForm.timeRange, this.ruleForm.location, this.ruleForm.customerNum, this.customerForm)
      }
    },
    // 新增，更新客户信息
    async updateCustomer () {
      this.customerForm.aid = this.aid
      this.customerForm.cusNum = this.customerForm.appInfo.length
      let uid = this.$store.state.currentUid
      let info = JSON.stringify(this.customerForm)
      console.log('updateCustomer:', uid, info)
      await api._updCustomer(uid, info).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('用户信息更新失败！')
        } else if (Number(res.resultCode) === 1) {
          this.$message.success('用户信息更新成功!')
        }
      })
    },
    // 新增，更新报名信息
    async updateEntry (flag) {
      let aid = this.aid
      let uid = this.$store.state.currentUid
      let creator = this.ruleForm.teamLeader
      let branch = this.ruleForm.branch
      let name = this.$store.state.currentUserName
      let date = this.ruleForm.startDate
      let time = this.ruleForm.timeRange
      let place = this.ruleForm.location
      let customerNum = this.ruleForm.customerNum
      let eFlag = flag
      let uFlag = this.update
      console.log('updateEntry:', aid, uid, branch, creator, name, date, time, place, customerNum, eFlag, uFlag)
      await api._updEntry(aid, uid, branch, creator, name, date, time, place, customerNum, eFlag, uFlag).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('更新失败！')
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('链接失败，请重试！')
        } else if (Number(res.resultCode) === 1) {
          this.$message.success('新增报名成功!')
          this.updateCustomer()
        } else if (Number(res.resultCode) === 2) {
          this.$message.success('报名信息更新成功!')
          this.updateCustomer()
        } else if (Number(res.resultCode) === 3) {
          this.$message.error('存在重复报名，请联系系统管理员。')
        } else {
          this.$message.error('resultCode:' + res.resultCode)
        }
      })
    },
    // 选择机构列表
    // chooseBranchList () {
    // let role = this.$store.state.currentRole
    // let branch = this.$store.state.currentBranch
    // if (Number(role) > 1) {
    //   this.ruleForm.branch = branch
    //   this.chooseList = this.branchList
    // } else {
    //   this.ruleForm.branch = branch
    //   this.chooseList.push({label: '1', value: branch})
    // }
    //   this.chooseList = _select.selectBranchList()
    //   console.log('chooseList', this.chooseList)
    // },
    // 提交报名
    submit (formName) {
      let cusNum = this.customerForm.appInfo.length
      let validCount = 0
      if (Number(this.ruleForm.customerNum) !== Number(cusNum)) {
        this.$message.error('邀约客户数填写错误！')
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            for (let i = 0; i < cusNum; i++) {
              if (this.customerForm.appInfo[i].cus_id.length === 0) {
                this.customerForm.appInfo[i].cus_id = '000000000000000000'
              }
              this.$refs['customerForm'][i].validate((valid) => {
                console.log('customerForm', this.$refs['customerForm'][i])
                console.log('valid', valid)
                if (valid) {
                  validCount++
                } else {
                  this.$message.error('客户信息' + (i + 1) + '填写错误，提交失败！')
                  return false
                }
              })
            }
          } else {
            this.$message.error('报名信息填写错误，提交失败！')
            return false
          }
        })
      }
      console.log('validCount', validCount)
      if (validCount === cusNum) {
        // 提交标志位
        let flag = 1
        this.updateEntry(flag)
        setTimeout(() => {
          this.$router.push({path: '/detail', query: {aid: this.aid}})
        }, 1000)
      }
    },
    // 移除客户信息
    removeCustomer (item) {
      let index = this.customerForm.appInfo.indexOf(item)
      if (index !== -1) {
        this.customerForm.appInfo.splice(index, 1)
        this.ruleForm.customerNum--
      }
    },
    // 新增客户
    addCustomer () {
      this.customerForm.appInfo.push({
        cus_name: '',
        cus_id: '',
        cus_tel: '',
        cus_age: ''
      })
      this.ruleForm.customerNum++
    }
  },
  data () {
    let checkTel = (rule, value, callback) => {
      if (value.length !== 11) {
        callback(new Error('请正确输入11位手机号'))
      } else {
        callback()
      }
    }
    let checkId = (rule, value, callback) => {
      let errorMsg = idValidate(value)
      if (errorMsg !== '') {
        callback(new Error(errorMsg))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        branch: this.$store.state.currentBranch,
        teamLeader: '',
        startDate: '',
        endDate: '',
        dateRange: [],
        timeRange: '',
        location: '',
        customerNum: 1
      },
      customerForm: {
        cusNum: 0,
        aid: 0,
        ent_id: '',
        appInfo: [{
          cus_name: '',
          cus_id: '',
          cus_tel: '',
          cus_age: ''
        }]
      },
      rules: {
        branch: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ],
        teamLeader: [
          { required: true, message: '请填写团队长', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        timeRange: [
          { required: true, message: '请选择时间段', trigger: 'change' }
        ],
        location: [
          { required: true, message: '请填写举办地点', trigger: 'blur' }
        ],
        customerNum: [
          { required: true, message: '请填写邀约客户数', trigger: 'blur' }
        ],
        cus_name: [
          { required: true, message: '请填写客户姓名', trigger: 'blur' }
        ],
        cus_id: [
          { required: true, message: '请填写客户身份证号', trigger: 'blur' },
          { validator: checkId, trigger: 'blur' }
        ],
        cus_age: [
          { required: true, message: '请填写客户年龄', trigger: 'blur' }
        ],
        cus_tel: [
          { required: true, message: '请填写客户联系方式', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ]
      },
      value: '',
      chooseList: [],
      branchList: [
        {label: '1', value: '余慈'},
        {label: '2', value: '宁海'},
        {label: '3', value: '北仑'},
        {label: '4', value: '慈溪'},
        {label: '5', value: '象山'},
        {label: '6', value: '镇海'},
        {label: '7', value: '一支'},
        {label: '8', value: '四支'},
        {label: '9', value: '余姚'},
        {label: '10', value: '宇洋'},
        {label: '11', value: '鄞州'},
        {label: '12', value: '奉化'},
        {label: '13', value: '二支'},
        {label: '14', value: '溪口'}
      ]
    }
  },
  mounted () {
    this.ruleForm.teamLeader = this.$store.state.currentLeaderName
    this.customerForm.ent_id = this.$store.state.currentUserCode
    // this.chooseBranchList()
  },
  watch: {
    data (newVal, oldVal) {
      if (newVal) {
        this.getEntry()
      }
    },
    start (newVal, oldVal) {
      if (newVal) {
        this.ruleForm.startDate = this.start.split(' ')[0]
      }
    },
    end (newVal, oldVal) {
      if (newVal) {
        this.ruleForm.endDate = this.end.split(' ')[0]
      }
    },
    timeRange (newVal, oldVal) {
      if (newVal) {
        this.ruleForm.timeRange = this.timeRange
      }
    },
    location (newVal, oldVal) {
      if (newVal) {
        this.ruleForm.location = this.location
      }
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/form.styl"
  .entry
    form()
  .input-customer-info
    border 1px solid #dcdfe6
    border-radius: 4px
    height: 30px
    line-height: 30px
    width: 50% !important
  .delete-customer-info
    float: right
    position: absolute
    right: 0
    margin-top: -168px !important
    border-radius: 50% !important
    padding: 20px !important
    font-size: 14px !important
    border: 0 !important
  .entry-button
    display: flex
    flex-direction: row
    justify-content: space-between
    .button
      width: 50%
      margin: 0 10px
      padding: 8px
  .entry-separate
    separate($margin: 2px)
  .must-fix
    must-fix()
</style>
