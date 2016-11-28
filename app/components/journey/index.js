'use strict';

import React, {Component} from 'react';
import { connect } from 'react-redux';
import {View, Text, StyleSheet, InteractionManager, PixelRatio, TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {colors} from '../../lib/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  travelTime,
  travelTimeString,
  leaveTime,
  leaveTimeString,
  arriveBefore,
  isLate,  
} from '../../lib/time';

class Journey extends Component {
  
  componentWillMount() {
    Mapbox.setAccessToken('pk.eyJ1IjoiaXRzZXRhaSIsImEiOiJjaXNneGxxNHQwMDE4MnRwaXBxbnFvbzFwIn0.vWdz0wM8qWICZblz22hWGw');
  }

  updateMap() {
    InteractionManager.runAfterInteractions(() => {
      if (!this._map || !this.props || !this.props.geocode.latitude) {return}
      this._map.setVisibleCoordinateBounds(
        this.props.currentLocation.latitude, 
        this.props.currentLocation.longitude, 
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
    const { state, actions, time, distance } = this.props;
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
        <TouchableOpacity onPress={() => {Actions.welcome()}} style={styles.icon_container}>
          <Icon
            name='chevron-left'
            size={20}
            color={colors.CTA}
          />
        </TouchableOpacity>
        <View style={styles.innerContainer}>
          <Text style={[styles.leave_at, isLate(time, distance) ? styles.late : {}]}>
            leave at:
          </Text>
          <Text style={[styles.leave_at_time, isLate(time, distance) ? styles.late : {}]}> 
            {leaveTimeString(time, distance)}
          </Text>
          <View style={styles.time_table}>
            <Text style={styles.more_info}> 
              travel time: 
            </Text>
            <Text style={styles.more_info_time}> 
              {travelTimeString(time, distance)}
            </Text>
          </View>
          <View style={styles.time_table}>
            <Text style={styles.more_info}>
              arrive before:
            </Text>
            <Text style={styles.more_info_time}> 
              {arriveBefore(time, distance)}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //TEXT
  icon_container: {
    position: 'absolute',
    left: 15,
    top: 30,
    backgroundColor: colors.transparent,
  },
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
    backgroundColor: colors.background,
    shadowRadius: 1,
    shadowOpacity: .05,
    elevation: 1,
  },
})

const mapStateToProps = state => ({
  time: state.form.time,
  location: state.form.location,
  geocode: state.location.geocode,
  distance: state.location.distance,
  currentLocation: state.location.currentLocation,
  annotations: state.location.annotations,
})

export default connect(mapStateToProps)(Journey);