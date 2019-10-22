import { CLEAR_SETTINGS } from './types'

export type SettingsState = {
  locale: string
}

const INITIAL_STATE: SettingsState = {
  locale: 'en'
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CLEAR_SETTINGS:
      return INITIAL_STATE
    default:
      return state
  }
}

export default reducer
