import { CLEAR_USER, UserActions, SET_ID } from './types'

export type UserState = {
  id: string
}

const INITIAL_STATE: UserState = {
  id: null
}

const reducer = (state = INITIAL_STATE, action: UserActions) => {
  switch (action.type) {
    case SET_ID:
      return { ...state, id: action.id }
    case CLEAR_USER:
      return INITIAL_STATE
    default:
      return state
  }
}

export default reducer
