'use strict';

import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Text, View, StyleSheet} from 'react-native';
import { Actions } from 'react-native-router-flux';
import FormView from './form';
import { updateForm, submitForm } from '../../redux/form/action-creators'

class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  actions = {
    updateForm: this.props.updateForm,
    submitForm: this.props.submitForm
  }

  render() {
    return ( 
      <View style={{flex: 1}}>
        <FormView
          actions={this.actions}
          routes={this.props.state.routes}
          next={Actions.journey}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  state
})

const mapDispatchToProps = dispatch => ({
  updateForm: (data) => {
    dispatch(updateForm(data))
  },
  submitForm: () => {
    dispatch(submitForm())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);