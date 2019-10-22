import settingsReducer, { SettingsState } from './reducer'
import * as settingsActions from './actions'
import * as settingsTypes from './types'
import settingsSaga from './sagas'

export {
  settingsActions,
  settingsReducer,
  SettingsState,
  settingsTypes,
  settingsSaga
}
