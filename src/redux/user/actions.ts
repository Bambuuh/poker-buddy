import { CLEAR_USER, UserActions, SET_ID } from './types'

export const clearUser = (): UserActions => ({
  type: CLEAR_USER
})

export const setUserId = (id: string): UserActions => ({
  type: SET_ID,
  id
})
