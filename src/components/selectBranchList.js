import store from '../store'

const branchList = [
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

const branchList2 = []
const selectBranchList = () => {
  let role = store.state.currentRole
  let branch = store.state.currentBranch
  if (Number(role) > 1) {
    return branchList
  } else {
    branchList2.push({label: '1', value: branch})
    return branchList2
  }
}

export default { selectBranchList }
