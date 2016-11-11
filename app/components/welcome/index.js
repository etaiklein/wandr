'use strict';

import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  InteractionManager, 
  PixelRatio, 
  TimePickerAndroid, 
  TouchableWithoutFeedback, 
  Platform, 
  TextInput, 
  DatePickerIOS} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { updateForm, submitForm } from '../../redux/form/action-creators';
import { fetchGeocode, 
  fetchDistance, updateCurrentLocation, setGeocode } from '../../redux/location/action-creators';
import {colors} from '../colors'
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
        this.props.updateCurrentLocation(current_location);
        if (this.props.geocode[0] === "") {return}
        let route = [this.polylineFormat(this.props.geocode), current_location]
        this.props.fetchDistance(route);
        this.setPushNotificationSchedule();
      });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  handleLocationChange(event){
    handleFormChange({
      location: event.nativeEvent.text
    })
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

  onDateChange(date) {
    console.log(date);
  }

  formatTime(hour, minute) {
    return hour + ':' + (minute < 10 ? '0' + minute : minute);
  }

  async showPicker(options){
    try {
      const {action, minute, hour} = await TimePickerAndroid.open(options);
      if (action === TimePickerAndroid.timeSetAction) {
        let timeString = this.formatTime(hour, minute);
        let date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);
        let formData = Object.assign({}, this.props.form, {
          time: date,
          timeString: timeString
        });
        return this.props.updateForm(formData);
      } else {
        return "";
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    console.log(colors.CTA);
    return (
      <View style={styles.outerContainer}>
        <ScrollView style={styles.innerContainer}>
          {(Platform.OS === 'ios') && 
            <Form
              style={styles.form}
              ref='welcomeForm'
              onChange={this.handleFormChange.bind(this)}>
              <Text style={[styles.text, styles.title]}>i want to arrive at</Text>
              <View style={styles.separator}/>
              <InputField 
                ref='location' 
                valueStyle={styles.text}
                placeholderStyle={styles.text}
                style={styles.text}
                placeholder='Current Location'/>
              <View style={styles.separator}/>
              <TimePickerField 
                date={new Date(Date.now() + 30*60000)}
                dateTimeFormat={(time) => time.toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}
                valueStyle={styles.text}
                placeholderStyle={styles.text}
                style={styles.text}
                ref='time'/>
            </Form>
          }
          {(Platform.OS === 'android') && 
            <View>
              <TextInput
                style={styles.text}
                autoCorrect={true}
                onChange={this.handleLocationChange}
              />
              <View style={styles.separator}/>
              <View title="TimePickerAndroid">
                <TouchableOpacity
                  onPress={this.showPicker.bind(this, {})}>
                  <Text style={styles.text}>{this.props.form.timeString || new Date().toTimeString()}</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        </ScrollView>
        <TouchableOpacity style={styles.buttonContainer} onPress={this.handleSubmit.bind(this)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Wander!</Text>
          </View>
        </TouchableOpacity>
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
    paddingTop: 80,
    flex: 1,
    backgroundColor: colors.white,
  },
  innerContainer: {
    marginTop: 20,
    marginBottom: 100,
    backgroundColor: colors.white,
  },
  text: {
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 10 * PixelRatio.getFontScale(),
    color: colors.primary,
    backgroundColor: colors.white,
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
    borderColor: colors.CTA,
    backgroundColor: colors.white
  },
  buttonText: {
    color: colors.CTA,
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