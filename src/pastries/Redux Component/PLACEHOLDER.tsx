import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { MainState } from '../../redux/reducers'

type OwnProps = {}
type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = ReturnType<typeof mapDispatchToProps>
type Props = OwnProps & StateProps & DispatchProps

class PASCAL_PLACEHOLDER extends Component<Props> {
  render() {
    return null
  }
}

const mapStateToProps = ({  }: MainState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PASCAL_PLACEHOLDER)
