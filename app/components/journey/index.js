'use strict';

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {View, Text, StyleSheet, InteractionManager, PixelRatio} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Mapbox, { MapView } from 'react-native-mapbox-gl';

Mapbox.setAccessToken('pk.eyJ1IjoiaXRzZXRhaSIsImEiOiJjaXNneGxxNHQwMDE4MnRwaXBxbnFvbzFwIn0.vWdz0wM8qWICZblz22hWGw');

class Journey extends Component {
  constructor(props) {
    super(props);
  }

  travelTime() {
    return Math.ceil(this.props.distance / 60);
    
  }

  travelTimeString() {
    return `${this.travelTime()} min`
  }

  leaveTime() {
    return this.props.form.time.getTime() - this.props.distance * 1000 - 60 * 5 * 1000
  }

  leaveTimeString() {
    if (!this.props.form.time) {return ''}
    let time = this.leaveTime();
    return `${new Date(time).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}`
  }

  arriveBefore() {
    if (!this.props.form.time) {return ''}
    return `${this.props.form.time.toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}`
  }

  isLate() {
    return this.leaveTime() < new Date();
  }

  updateMap() {
    InteractionManager.runAfterInteractions(() => {
      if (!this._map || !this.props || !this.props.geocode.latitude) {return}
      this._map.setVisibleCoordinateBounds(
        this.props.current_location.latitude, 
        this.props.current_location.longitude, 
        this.props.geocode.latitude, 
        this.props.geocode.longitude, 
        150, //paddingTop
        150,  //paddingRight
        150,  //paddingBottom
        150,  //paddingLeft
        true //animation
      );
    });
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
            latitude: this.props.current_location.latitude,
            longitude: this.props.current_location.longitude
          }}
          initialZoomLevel={11}
          annotations={this.props.annotations}
          userTrackingMode={Mapbox.userTrackingMode.none}
          initialDirection={0}
          rotateEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
          logoIsHidden={true}
          showsUserLocation={true}
          styleURL={Mapbox.mapStyles.bright}
          annotationsAreImmutable
        />
        <View style={styles.innerContainer}>
          <Text style={styles.title}> 
            travel time: 
            <Text style={styles.time}> 
              {this.travelTimeString()}
            </Text>
          </Text>
          <Text style={[styles.title, this.isLate() ? styles.late : {}]}>
            leave at:
             <Text style={styles.time}> 
              {this.leaveTimeString()}
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
    fontSize: 12 * PixelRatio.getFontScale(),
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
  late: {
    color: 'red',
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