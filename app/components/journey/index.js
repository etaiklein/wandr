'use strict';

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {View, Text} from 'react-native';
import { Actions } from 'react-native-router-flux';

class Journey extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { state, actions } = this.props;
    return ( 
      <View style={{margin: 128}}>
        <Text >{state.routes.scene.title}</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  state
})

export default connect(mapStateToProps)(Journey);