'use strict';

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {View, Text, StyleSheet} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Mapbox, { MapView } from 'react-native-mapbox-gl';

Mapbox.setAccessToken('pk.eyJ1IjoiaXRzZXRhaSIsImEiOiJjaXNneGxxNHQwMDE4MnRwaXBxbnFvbzFwIn0.vWdz0wM8qWICZblz22hWGw');

class Journey extends Component {
  constructor(props) {
    super(props);
  }

  buildAnnotation() {
    let annotations = [{
      coordinates: this.props.geocode,
      type: 'point',
      id: "destination"
    }];
    console.log(annotations);
    return annotations;
  }

  render() {
    const { state, actions } = this.props;
    return (
      <View style={styles.container}>
        <MapView
          ref={map => { this._map = map; }}
          style={styles.map}
          initialCenterCoordinate={{
            latitude: 40.731982923355005,
            longitude: -73.99518334071513
          }}
          initialZoomLevel={11}
          // onFinishLoadingMap={}
          // onRegionDidChange={}
          annotations={this.buildAnnotation()}
          userTrackingMode={Mapbox.userTrackingMode.none}
          initialDirection={0}
          rotateEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
          logoIsHidden={true}
          showsUserLocation={true}
          styleURL={Mapbox.mapStyles.light}
          annotationsAreImmutable
        />
        <View style={styles.innerContainer}>
          <Text style={styles.reminder}> Alarm in: 
            {}
          </Text>
          <Text style={styles.reminder}>
            Walking time:
            {}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  reminder: {
    fontSize: 40,
    textAlign: 'center'
  },
  container: {
    flex: 1
  },
  map: {
    flex: 0.5
  },
  innerContainer: {
    flex: 0.5,
    marginTop: 150,
    marginHorizontal: 20,
  },
})

const mapStateToProps = state => ({
  form: state.form.formData,
  geocode: state.location.geocode,
  distance: state.location.distance,
  current_location: state.location.current_location,
})

export default connect(mapStateToProps)(Journey);