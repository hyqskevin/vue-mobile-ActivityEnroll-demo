
import api from '@/plugins/api'

let ageList = [
  {value: 0, name: '<30'},
  {value: 0, name: '30-40'},
  {value: 0, name: '40-50'},
  {value: 0, name: '50-60'},
  {value: 0, name: '>60'}
]

function ageRange (customerList) {
  // 判断客户年龄区间
  for (let i in customerList) {
    let age = Number(customerList[i].cus_age)
    if (age < 30) {
      ageList[0].value++
    } else if ((age >= 30) && (age < 40)) {
      ageList[1].value++
    } else if ((age >= 40) && (age < 50)) {
      ageList[2].value++
    } else if ((age >= 50) && (age < 60)) {
      ageList[3].value++
    } else if (age > 60) {
      ageList[4].value++
    }
  }
}

export default {

  // 提取报名的销售人员工号，获取客户信息，判断年龄区间
  async countAgeList (aid, uid, data) {
    // 获取销售人员工号
    if (data.length !== 0) {
      // 循环每个工号获取所有客户报名列表
      for (let i in data) {
        let entId = data[i].ent_id
        let customerList = []
        let cFlag = 0
        await api._getCustomerEntryList(aid, uid, entId, cFlag).then(res => {
          if (Number(res.resultCode) === 0) {
            customerList = []
          } else if (Number(res.resultCode) === -1) {
            this.$message.error('参数错误，请重试！')
          } else {
            customerList = res.applInfo
            ageRange(customerList)
          }
        })
      }
      // console.log('ageList:', ageList)
      return ageList
    } else {
      return 0
    }
  }
}
