import { SET_BLAZE_TREE } from '../constants'

export default {
  blazeTree (state = [], action) {
    switch(action.type){
      case SET_BLAZE_TREE:
        return action.data;
      default:
        return state
    }
  }
};