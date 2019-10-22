import React, { Component } from 'react'
import { Button } from 'react-native'
import { CenteredFillView, Text, CircleView } from 'styled-native-kit'
import i18n, { keys } from '../../i18n'
import { createGame, getGames } from '../../firebase/game/game.repository'

type OwnProps = {}
type Props = OwnProps

class WelcomeScreen extends Component<Props> {
  onPressCreateGame = async () => {
    const game = await createGame()
    console.log(game)
  }

  onPressGetGames = async () => {
    const games = await getGames()
    console.log(games.docs)
  }

  render() {
    return (
      <CenteredFillView>
        <CircleView size={240} color="purple">
          <Text centered uppercase fontSize={100}>
            {i18n.t(keys.welcome)}
          </Text>
        </CircleView>
        <Button title="create game" onPress={this.onPressCreateGame} />
        <Button title="get games" onPress={this.onPressGetGames} />
      </CenteredFillView>
    )
  }
}

export default WelcomeScreen
