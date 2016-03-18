import { SET_BLAZE_TREE } from '../constants'

export function setBlazeTreeData(data) {
  return { 
    type: SET_BLAZE_TREE,
    data: data
  }
}
