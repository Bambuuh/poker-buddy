import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { NavigationState } from 'react-navigation'
import navigationService from './util/navigationService'
import RootNavigation from './navigation'
import actions from './redux/actions'
import config from './config/constants'
import { loginAnonymosly } from './firebase/auth'
import { setUserId } from './redux/user/actions'
import { store } from './redux'

type OwnProps = {}
type mapDispatchToProps = ReturnType<typeof mapDispatchToProps>
type Props = OwnProps & mapDispatchToProps

class App extends Component<Props> {
  async componentDidMount() {
    if (!store.getState().user.id) {
      const data = await loginAnonymosly()
      this.props.setUserId(data.user.uid)
    }
  }

  getActiveRouteName = navigationState => {
    if (!navigationState) {
      return null
    }
    const route = navigationState.routes[navigationState.index]

    if (route.routes) {
      return this.getActiveRouteName(route)
    }

    return route.routeName
  }

  handleNavigationStateChange = (
    prevState: NavigationState,
    currentState: NavigationState
  ) => {
    const { setCurrentScreen } = this.props
    const currentScreen = this.getActiveRouteName(currentState)
    const prevScreen = this.getActiveRouteName(prevState)

    if (prevScreen !== currentScreen) {
      setCurrentScreen(currentScreen)
    }
  }

  bindNavigator = navigatorRef =>
    navigationService.setTopLevelNavigator(navigatorRef)

  render() {
    return (
      <View style={{ flex: 1 }}>
        <RootNavigation
          onNavigationStateChange={this.handleNavigationStateChange}
          uriPrefix={config.deepLinkUriPrefix}
          ref={this.bindNavigator}
        />
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setUserId: (id: string) => dispatch(setUserId(id)),
  setCurrentScreen: (screenName: string) =>
    dispatch(actions.misc.setCurrentScreen(screenName))
})

export default connect(
  null,
  mapDispatchToProps
)(App)
