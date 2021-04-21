<template>
  <div class="gather">
    <!-- 内容列表 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100%">
      <el-form-item label="到会用户数：" prop="customerNum">
        <article class="must-fix">必填</article>
        <el-input v-model="ruleForm.customerNum" placeholder="请填写到会用户数"></el-input>
      </el-form-item>
      <div class="gather-separate" />
      <el-form-item label="活动信息：" prop="premium">
        <article class="must-fix">必填</article>
        <el-input v-model="ruleForm.premium" placeholder="请填写活动信息"></el-input>
      </el-form-item>
      <div class="gather-separate" />
      <el-form-item label="活动照片：" prop="picture">
        <article class="must-fix">必填</article>
        <el-upload
          action="actionUrl"
          list-type="picture-card"
          ref="upload"
          :limit="5"
          :file-list="fileList"
          :auto-upload="false"
          :on-change="getFile"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <div slot="tip" class="el-upload__tip">最多上传5张jpg/png文件</div>
          <el-icon class="el-icon-plus"></el-icon>
        </el-upload>
        <el-button size="small" type="primary" @click="submitPic">点击上传</el-button>
        <el-dialog :visible.sync="visible" :modal="false">
          <img width="100%" :src="imageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item v-if="imageUrl.length !== 0">
        <img width="90%" :src="imageUrl" alt="">
      </el-form-item>
    </el-form>
    <div style="height: 40px"></div>
  </div>
</template>

<script>
import api from '@/plugins/api'
export default {
  name: 'GatherList',
  props: {
    aid: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => []
    },
    update: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 获取活动照片
    async getImage () {
      let aid = this.aid
      let uid = this.$store.state.currentUid
      await api._getImage(uid, aid).then(res => {
        if (Number(res.resultCode) === 0) {
          this.fileList = []
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          console.log('res', res, typeof (res.act_img))
          // 若为空或无数据，不做处理，若为string，判断是否为json格式
          if (res.act_img === null) {
            this.fileList = []
            console.log('act_img=null', res.act_img)
          } else if (res.act_img === undefined) {
            this.fileList = []
            console.log('act_img=undefined', res.act_img)
          } else if (typeof (res.act_img) === 'object') {
            // 判断是否为json格式
            // let jsonFlag = this.isJson(res.act_img)
            // if (jsonFlag) {
            // 字符串做parse处理
            // this.fileList = JSON.parse(res.act_img)
            this.fileList = res.act_img
            console.log('res_parse', this.fileList, typeof (this.fileList))
          } else if (typeof (res.act_img) === 'string') {
            // 只接收到base64
            this.fileList.push({name: this.aid + '.jpg', url: res.act_img})
            console.log('act_img=base64', res.act_img)
          } else {
            this.$message.error('图片格式错误，请联系系统管理员解决。')
          }
        }
        console.log('fileList:', this.fileList)
      })
    },
    // 获取已有的汇总表
    getGather () {
      if (this.data.length !== 0) {
        console.log('getGatherData:', this.data)
        this.ruleForm.customerNum = this.data.act_arv_sum
        this.ruleForm.policyNum = this.data.pre_prem_num
        this.ruleForm.premium = this.data.pre_prem_sum
        console.log('getGatherInfo:', this.ruleForm.customerNum, this.ruleForm.policyNum, this.ruleForm.premium)
      }
    },
    // 新增，更新汇总信息
    async updateCollect () {
      let aid = this.aid
      let uid = this.$store.state.currentUid
      let customerNum = this.ruleForm.customerNum
      let policyNum = this.ruleForm.policyNum
      let premium = this.ruleForm.premium
      console.log('updateEntry:', aid, uid, customerNum, policyNum, premium)
      await api._updCollect(aid, uid, customerNum, policyNum, premium).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('更新失败！')
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('链接失败，请重试！')
        } else if (Number(res.resultCode) === 1) {
          this.$message.success('汇总信息更新成功!')
          this.$router.push({ path: '/detail', query: { aid: this.aid } })
        } else {
          this.$message.error('resultCode:' + res.resultCode)
        }
      })
    },
    // 提交报名
    submit (formName) {
      if (!this.imgFlag && (this.fileList.length !== 0)) {
        this.submitPic()
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateCollect()
          this.imgFlag = false
        } else {
          this.$message.error('验证未通过，提交失败！')
          return false
        }
      })
    },
    // 图片转base64
    getBase64 (file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function () {
          imgResult = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(imgResult)
        }
      })
    },
    // 获取上传的文件信息
    getFile (file) {
      this.getBase64(file.raw).then(res => {
        this.fileList.push({url: res})
      })
    },
    // 上传所有图片
    async submitPic () {
      let uid = this.$store.state.currentUid
      let len = this.fileList.length
      if (len === 0) {
        this.$message.info('请先添加活动照片')
      } else {
        // 上传照片
        const loading = this.$loading({
          lock: true,
          text: '正在上传图片',
          spinner: 'el-icon-loading',
          background: 'rgba(204,204,204,0.7)'
        })
        let file = JSON.stringify(this.fileList)
        // console.log('updateFile:', file)
        await api._updImage(uid, this.aid, file).then(res => {
          if (Number(res.resultCode) === 0) {
            this.$message.error('上传失败！')
          } else if (Number(res.resultCode) === -1) {
            this.$message.error('链接失败，请重试！')
          } else if (Number(res.resultCode) === 1) {
            this.$message.success('照片上传成功!')
          } else {
            this.$message.error('resultCode:' + res.resultCode)
          }
        })
        loading.close()
        this.imgFlag = true
      }
    },
    // 移除照片
    handleRemove (file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    handlePictureCardPreview (file) {
      this.imageUrl = file.url
      this.visible = true
    }
  },
  data () {
    return {
      actionUrl: '',
      imageUrl: '',
      imgFlag: false,
      fileList: [],
      visible: false,
      ruleForm: {
        customerNum: 0,
        policyNum: 0,
        premium: 0,
        picture: {}
      },
      rules: {
        customerNum: [
          { required: true, message: '请输入参与用户数量', trigger: 'blur' }
        ],
        premium: [
          { required: true, message: '请填写活动信息', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // 获取活动信息
    data (newVal, oldVal) {
      if (newVal) {
        this.getGather()
      }
    },
    // 更新活动
    update (newVal, oldVal) {
      if (newVal) {
        this.submit('ruleForm')
      }
    },
    // 获取活动照片
    aid (newVal, oldVal) {
      if (newVal) {
        this.getImage()
      }
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/form.styl"
  .gather
    form()
  .gather-separate
    separate($margin: 2px)
  .must-fix
    must-fix()
  .el-upload--picture-card
    width 50px !important
    height 50px !important
    line-height 60px !important
  .el-upload-list__item
    width: 180px !important
    height: 120px !important
  .el-dialog
    width: 100% !important
</style>
