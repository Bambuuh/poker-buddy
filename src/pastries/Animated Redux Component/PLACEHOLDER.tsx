import React, { Component } from 'react'
import { Animated } from 'react-native'

type OwnProps = {}
type Props = OwnProps
class PLACEHOLDER extends Component<Props> {
  animatedValue = new Animated.Value(0)

  componentDidMount() {
    this.animate()
  }

  animate = (toValue = 1) =>
    Animated.timing(this.animatedValue, {
      toValue,
      duration: 200
    }).start()

  render() {
    const translateY = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 100]
    })

    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })

    const scale = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2]
    })

    return null
  }
}

export default PLACEHOLDER
