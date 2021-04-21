import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 100000
axios.defaults.params = {}

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    } else if (config.method === 'get') {
      let newParams = {}
      for (let key in config.params) {
        newParams[key] = encodeURIComponent(config.params[key])
      }
      config.params = newParams
      config.headers = {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
// axios.interceptors.response.use(
//   response => {
//     let data = response.data
//     if(data.successFlag === 1) {
//       //关闭显示LoadingBar
//       iView.LoadingBar.finish();
//       return Promise.resolve(data)
//     } else {
//       iView.LoadingBar.error();
//       return Promise.reject(data)
//     }
//   },
//   error => {
//     iView.LoadingBar.error();
//     return Promise.reject(error)
//   }
// )

// 封装获取数据
export const oGet = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}

// 封装发送数据
export const oPost = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}

// 封装修改数据
export const oUpdate = (url, param, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, param, params)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}

// 封装删除数据
export const oRemove = (url, param, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}

export default {
  /* 查询 */
  // 获取用户信息
  _getUserInfo (uid) {
    return oGet('test.do', {
      params: {pid: uid}
    })
    // return oGet('/api/GetUserInfo')
  },

  // 获取最近可参与的活动
  _getActInfo (uid, startTime, endTime, actLine) {
    return oGet('test.do', {
      params: {
        pid: uid,
        startTime: startTime,
        endTime: endTime,
        act_line: actLine
      }
    })
    // return oGet('/api/GetActInfo')
  },
  // 获取历史活动，参与活动
  _getActHis (uid, cFlag, branch, startTime, endTime, role) {
    return oGet('test.do?' + 'pid=' + uid + '&cFlag=' + cFlag + '&branch=' + branch + '&startTime=' + startTime + '&endTime=' + endTime + '&role=' + role)
    // return oGet('/api/GetActHis')
  },
  // 获取当前能参与的活动数量
  _getActSum (uid) {
    return oGet('test.do?' + 'pid=' + uid)
  },
  // 获取活动信息表
  _getActivity (aid, uid, userName) {
    return oGet('test.do?' + 'aid=' + aid + '&pid=' + uid + '&user_name=' + userName)
  },
  // 获取汇总表
  _getCollect (aid, uid) {
    return oGet('test.do?' + 'pid=' + uid + '&aid=' + aid)
  },
  // 获取活动信息描述
  _getActivityDescribe (aid, uid) {
    return oGet('test.do?' + 'aid=' + aid + '&pid=' + uid)
  },
  // 管理人员获取活动报名详情列表
  _getSalerEntryList (aid, uid) {
    return oGet('test.do?' + 'aid=' + aid + '&pid=' + uid)
  },
  // 销售人员获取活动报名详情列表
  _getCustomerEntryList (aid, uid, entId, cFlag) {
    return oGet('test.do?' + 'aid=' + aid + '&pid=' + uid + '&ent_id=' + entId + '&cflag=' + cFlag)
    // return oGet('/api/GetCustomerInfo2')
  },
  // 获取图片
  _getImage (uid, aid) {
    return oGet('test.do?' + 'pid=' + uid + '&aid=' + aid)
    // return oGet('/api/GetImgBase64')
  },
  // 获取个人信息
  _getPersonalInfo (uid) {
    return oGet('test.do?' + 'pid=' + uid)
  },
  // 获取周排名
  _getWeekRank (uid) {
    return oGet('test.do?' + 'pid=' + uid)
  },
  /* 新增，更新 */
  // 新增活动，更新活动
  _updActivity (aid, uid, creator, branch, name, line, cusLimit, timeRange, location, desc, startTime, endTime, role, cFlag) {
    return oPost('test.do?' + 'aid=' + aid + '&pid=' + uid + '&act_creater=' + creator + '&branch=' + branch + '&act_name=' + name + '&act_line=' + line + '&max_num=' + cusLimit + '&ent_time=' + timeRange + '&act_place=' + location + '&act_dtl=' + desc + '&startTime=' + startTime + '&endTime=' + endTime + '&act_role=' + role + '&cFlag=' + cFlag)
  },
  // 新增，更新报名
  _updEntry (aid, uid, branch, creator, name, startTime, endTime, place, customerNum, eFlag, uFlag) {
    return oPost('test.do?' + 'aid=' + aid + '&pid=' + uid + '&branch=' + branch + '&act_creater=' + creator + '&ent_name=' + name + '&cus_start_time=' + startTime + '&ent_time=' + endTime + '&act_place=' + place + '&single_cus_sum=' + customerNum + '&ent_flag=' + eFlag + '&update_flag=' + uFlag)
  },
  // 新增，更新用户信息
  _updCustomer (uid, info) {
    return oPost('test.do?' + 'pid=' + uid + '&strjson=' + info)
  },
  // 新增，更新汇总信息
  _updCollect (aid, uid, customerNum, premiumNum, premiumSum) {
    return oPost('test.do', {
      pid: uid,
      aid: aid,
      act_arv_sum: customerNum,
      pre_prem_num: premiumNum,
      pre_prem_sum: premiumSum
    })
  },
  // 上传图片
  _updImage (uid, aid, img) {
    return oPost('test.do?', {
      pid: uid,
      aid: aid,
      act_img: img
    })
  },
  // 上传心得
  _updateExperience (uid, aid, exp) {
    return oPost('test.do?', {
      pid: uid,
      aid: aid,
      act_exp: exp
    })
  },
  // 完成活动
  _updFinish (uid, aid, actFlag) {
    return oPost('test.do', {
      pid: uid,
      aid: aid,
      act_flag: actFlag
    })
  },
  /* 删除 */
  // 删除活动
  _delActivity (uid, aid) {
    return oPost('test.do?' + 'pid=' + uid + '&aid=' + aid)
  },
  // 删除报名
  _delEntry (uid, aid, entId) {
    return oPost('test.do?' + 'pid=' + uid + '&aid=' + aid + '&ent_id=' + entId)
  }
}
