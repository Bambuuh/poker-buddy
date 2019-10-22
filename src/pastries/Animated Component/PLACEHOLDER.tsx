import React, { Component } from 'react'
import { Animated } from 'react-native'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { MainState } from '../../redux/reducers'

type OwnProps = {}
type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = ReturnType<typeof mapDispatchToProps>
type Props = OwnProps & StateProps & DispatchProps

class PASCAL_PLACEHOLDER extends Component<Props> {
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

const mapStateToProps = ({  }: MainState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PASCAL_PLACEHOLDER)
