'use strict';

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {View, Text, StyleSheet, InteractionManager} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Mapbox, { MapView } from 'react-native-mapbox-gl';

Mapbox.setAccessToken('pk.eyJ1IjoiaXRzZXRhaSIsImEiOiJjaXNneGxxNHQwMDE4MnRwaXBxbnFvbzFwIn0.vWdz0wM8qWICZblz22hWGw');

class Journey extends Component {
  constructor(props) {
    super(props);
  }

  travelTime() {
    let minutes = Math.ceil(this.props.distance / 60);
    return `${minutes} min`
  }

  leaveAt() {
    if (!this.props.form.time) {return ''}
    let time = this.props.form.time.getTime() - this.props.distance * 1000 - 60 * 5 * 1000;
    return `${new Date(time).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}`
  }

  arriveBefore() {
    if (!this.props.form.time) {return ''}
    return `${this.props.form.time.toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}`
  }

  updateMap() {
    if (!this.props || !this.props.geocode) {return}

    this._map.setVisibleCoordinateBounds(
      this.props.current_location[0], 
      this.props.current_location[1], 
      this.props.geocode[0], 
      this.props.geocode[1], 
      150, //paddingTop
      50,  //paddingRight
      50,  //paddingBottom
      50,  //paddingLeft
      true //animation
    );
  }

  render() {
    const { state, actions } = this.props;
    return (
      <View style={styles.container}>
        <MapView
          ref={map => { this._map = map; }}
          style={styles.map}
          onUpdateUserLocation={() => this.updateMap()}
          initialCenterCoordinate={{
            latitude: this.props.current_location[0],
            longitude: this.props.current_location[1]
          }}
          initialZoomLevel={11}
          annotations={this.props.annotations}
          userTrackingMode={Mapbox.userTrackingMode.none}
          initialDirection={0}
          rotateEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
          logoIsHidden={true}
          showsUserLocation={true}
          styleURL={Mapbox.mapStyles.bright}
          annotationsAreImmutable
        />
        <View style={styles.innerContainer}>
          <Text style={styles.title}> 
            travel time: 
            <Text style={styles.time}> 
              {this.travelTime()}
            </Text>
          </Text>
          <Text style={styles.title}>
            leave at:
             <Text style={styles.time}> 
              {this.leaveAt()}
            </Text>
          </Text>
          <Text style={styles.title}>
            arrive before:
            <Text style={styles.time}> 
              {this.arriveBefore()}
            </Text>
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  title: {
    fontSize: 30,
    textAlign: 'center'
  },
  time: {
    fontWeight: 'bold',
  },
  container: {
    flex: 1
  },
  map: {
    flex: 0.7
  },
  innerContainer: {
    flex: 0.3,
    marginTop: 20,
    marginHorizontal: 20,
  },
})

const mapStateToProps = state => ({
  form: state.form.formData,
  geocode: state.location.geocode,
  distance: state.location.distance,
  current_location: state.location.current_location,
  annotations: state.location.annotations,
})

export default connect(mapStateToProps)(Journey);