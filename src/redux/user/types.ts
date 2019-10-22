export const CLEAR_USER = 'CLEAR_USER'
export const SET_ID = 'SET_ID'

interface SetUserIdAction {
  type: typeof SET_ID
  id: string
}

interface ClearUserAction {
  type: typeof CLEAR_USER
}

export type UserActions = SetUserIdAction | ClearUserAction
