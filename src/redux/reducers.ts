import { persistCombineReducers } from 'redux-persist'
import { AsyncStorage } from 'react-native'
import { MiscState, miscReducer } from './misc'
import { SettingsState, settingsReducer } from './settings'
import { UserState, userReducer } from './user'

const persistConfig = {
  key: 'primary',
  storage: AsyncStorage,
  whitelist: ['user', 'settings']
}

export type MainState = {
  misc: MiscState
  settings: SettingsState
  user: UserState
}

export default persistCombineReducers<MainState>(persistConfig, {
  misc: miscReducer,
  settings: settingsReducer,
  user: userReducer
})
