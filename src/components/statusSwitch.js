// 状态转换
const _statusSwitch = (flag) => {
  if (flag) {
    switch (flag) {
      case '0': return '进行中'
      case '1': return '已汇总'
      case '2': return '已完成'
      case '4': return '已取消'
      default: return '- undefined -'
    }
  } else return '未设置'
}
// 日期转换
const _setDate = (date) => {
  if (date) {
    return date.split(' ')[0]
  } else return '未设置'
}

export default { _statusSwitch, _setDate }
