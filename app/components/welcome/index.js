'use strict';

import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Text, View, ScrollView, TouchableOpacity, StyleSheet, InteractionManager, PixelRatio} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { updateForm, submitForm } from '../../redux/form/action-creators'
import { fetchGeocode, fetchDistance, updateCurrentLocation, setGeocode } from '../../redux/location/action-creators'

var PushNotification = require('react-native-push-notification');

import { Form,
  Separator,InputField, LinkField,
  SwitchField, PickerField,DatePickerField,TimePickerField
} from 'react-native-form-generator';


class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  watchID: ?number = null;

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      //get current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.props.updateCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
      this.watchID = navigator.geolocation.watchPosition((position) => {
        let current_location = this.polylineFormat(position.coords);
        let route = [this.polylineFormat(this.props.geocode), current_location]
        this.props.updateCurrentLocation(current_location);
        this.props.fetchDistance(route);
        this.setPushNotificationSchedule();
      });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  handleFormChange(formData){
    InteractionManager.runAfterInteractions(() => {
      this.props.updateForm(formData);
      this.props.fetchGeocode(this.props.form.location);
    });
  }

  polylineFormat(location){
    return [location.longitude, location.latitude];
  }

  classicFormat(location){
    return [location.latitude, location.longitude];
  }

  setPushNotificationSchedule() {
    if (!this.props.form || !this.props.form.time || !this.props.distance) {return}
    let time = this.props.form.time.getTime() - this.props.distance * 1000 - 60 * 5 * 1000;
    PushNotification.cancelAllLocalNotifications() //clear
    if (new Date(time) > new Date())
      PushNotification.localNotificationSchedule({
        message: "time to go!", // (required)
        date: new Date(time)
      });
  }

  handleSubmit(){
    InteractionManager.runAfterInteractions(() => {
      
      let route = [this.polylineFormat(this.props.geocode), this.polylineFormat(this.props.current_location)]
      
      if (this.props.geocode.latitude === '') {
        this.props.setGeocode(this.polylineFormat(this.props.current_location));
        route[0] = this.polylineFormat(this.props.current_location);
      }

      this.props.fetchDistance(route); 

      if (!this.props.form.time) {
        let formData = Object.assign({}, this.props.form, {
          time: new Date(Date.now() + 30*60000)
        });
        this.props.updateForm(formData);
      }

      this.setPushNotificationSchedule();
      Actions.journey();
    });

  }

  render() {
    return (
      <View style={styles.outerContainer}>
        <ScrollView style={styles.innerContainer}>
          <Form
            style={styles.form}
            ref='welcomeForm'
            onChange={this.handleFormChange.bind(this)}>
            <Text style={[styles.text, styles.title]}>i want to arrive at</Text>
            <View style={styles.separator}/>
            <InputField 
              ref='location' 
              valueStyle={styles.text}
              style={styles.text}
              placeholder='Current Location'/>
            <View style={styles.separator}/>
            <TimePickerField 
              date={new Date(Date.now() + 30*60000)}
              dateTimeFormat={(time) => time.toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}
              valueStyle={styles.text}
              ref='time'/>
          </Form>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.handleSubmit.bind(this)}>
            <Text style={styles.buttonText}>Wander!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  title: {
    fontSize: 15 * PixelRatio.getFontScale(),
    textAlign: 'center'
  },
  outerContainer: {
    marginTop: 80,
    flex: 1,
  },
  innerContainer: {
    marginTop: 20,
    marginBottom: 100
  },
  text: {
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 10 * PixelRatio.getFontScale(),
    color: 'black',
    textAlign: 'right'
  },
  separator: {
    marginTop: 30
  },
  buttonContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    bottom: 50,
  },
  button: {
    flex: 1,
    marginHorizontal: 100,
    padding:10, 
    height:45, 
    borderRadius:4, 
    borderWidth: 2,
    borderColor: '#007aff',
    backgroundColor: 'white'
  },
  buttonText: {
    color: '#007aff',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 10 * PixelRatio.getFontScale(),
    fontWeight: 'bold',
    textAlign: 'center',
  }
})

const mapStateToProps = state => ({
  form: state.form.formData,
  geocode: state.location.geocode,
  distance: state.location.distance,
  current_location: state.location.current_location,
})

const mapDispatchToProps = dispatch => ({
  updateForm: (data) => {
    dispatch(updateForm(data))
  },
  fetchGeocode: (data) => {
    dispatch(fetchGeocode(data))
  },
  fetchDistance: (data) => {
    dispatch(fetchDistance(data))
  },
  updateCurrentLocation: (data) => {
    dispatch(updateCurrentLocation(data))
  },
  setGeocode: (location) => {
    dispatch(setGeocode(location))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);