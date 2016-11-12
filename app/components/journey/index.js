'use strict';

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {View, Text, StyleSheet, InteractionManager, PixelRatio} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {colors} from '../colors'

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
    return new Date(this.props.time).getTime() - this.props.distance * 1000 - 60 * 5 * 1000
  }

  leaveTimeString() {
    if (!this.props.time) {return ''}
    let time = this.leaveTime();
    return `${new Date(time).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}`
  }

  arriveBefore() {
    if (!this.props.time) {return ''}
    return `${new Date(this.props.time).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}`
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
            latitude: 39.14,
            longitude: -77.15
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
          <Text style={[styles.leave_at, this.isLate() ? styles.late : {}]}>
            leave at:
          </Text>
          <Text style={[styles.leave_at_time, this.isLate() ? styles.late : {}]}> 
            {this.leaveTimeString()}
          </Text>
          <View style={styles.time_table}>
            <Text style={styles.more_info}> 
              travel time: 
            </Text>
            <Text style={styles.more_info_time}> 
              {this.travelTimeString()}
            </Text>
          </View>
          <View style={styles.time_table}>
            <Text style={styles.more_info}>
              arrive before:
            </Text>
            <Text style={styles.more_info_time}> 
              {this.arriveBefore()}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //TEXT
  leave_at: {
    color: colors.primary,
    fontSize: 12 * PixelRatio.getFontScale(),
  },
  leave_at_time: {
    color: colors.primary,
    fontSize: 35 * PixelRatio.getFontScale(),
    textAlign: 'center',
  },
  more_info: {
    color: colors.primary,
    fontSize: 10 * PixelRatio.getFontScale(),
    justifyContent: 'flex-start',
    flex: 0.5,
  },
  more_info_time: {
    color: colors.primary,
    fontSize: 10 * PixelRatio.getFontScale(),
    fontWeight: 'bold',
    textAlign: 'right',
    justifyContent: 'flex-end',
    flex: 0.5,
  },
  late: {
    color: colors.error,
  },
  time_table: {
    flexDirection: 'row',
  },

  container: {
    flex: 1,
    flexDirection: 'column',
  },
  map: {
    flex: 1,
  },
  innerContainer: {
    padding: 20,
    justifyContent: 'flex-end',
    backgroundColor: colors.background
  },
})

const mapStateToProps = state => ({
  time: state.form.time,
  location: state.form.location,
  geocode: state.location.geocode,
  distance: state.location.distance,
  current_location: state.location.current_location,
  annotations: state.location.annotations,
})

export default connect(mapStateToProps)(Journey);