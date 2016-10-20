'use strict';

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {Text, TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux';

class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { state, actions } = this.props;
    return ( 
      <TouchableOpacity onPress={Actions.journey} style={{margin: 128}}>
        <Text >{state.routes.scene.title}</Text>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  state
})

export default connect(mapStateToProps)(Welcome);