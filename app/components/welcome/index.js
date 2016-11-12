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
import { updateLocation, updateTime, submitForm, togglePicker } from '../../redux/form/action-creators';
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
        if (this.props.geocode.latitude === "") {return}
        let route = [this.polylineFormat(this.props.geocode), current_location]
        this.props.fetchDistance(route);
        this.setPushNotificationSchedule();
      });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  handleTimeChange(event){
    InteractionManager.runAfterInteractions(() => {
      this.props.updateTime(event);
    });
  }

  handleLocationChange(event){
    InteractionManager.runAfterInteractions(() => {
      this.props.updateLocation(event);
    });
  }

  handleLocationSubmit(event){
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchGeocode(this.props.location);
    });
  }

  polylineFormat(location){
    return [location.longitude, location.latitude];
  }

  classicFormat(location){
    return [location.latitude, location.longitude];
  }

  setPushNotificationSchedule() {
    if (!this.props.time || !this.props.distance) {return}
    let time = new Date(this.props.time).getTime() - this.props.distance * 1000 - 60 * 5 * 1000;
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
      
      if (this.props.geocode.latitude === '' || this.props.location === "Current Location") {
        this.props.setGeocode(this.polylineFormat(this.props.current_location));
        route[0] = this.polylineFormat(this.props.current_location);
      }

      this.props.fetchDistance(route); 
      this.setPushNotificationSchedule();
      Actions.journey();
    });

  }

  timeString(date) {
    let time = new Date(date);
    return this.formatTime(time.getHours(), time.getMinutes());
  }

  formatTime(hour, minute) {
    return hour + ':' + (minute < 10 ? '0' + minute : minute);
  }

  async showPicker(options){
    try {
      const {action, minute, hour} = await TimePickerAndroid.open(options);
      if (action === TimePickerAndroid.timeSetAction) {
        let date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);
        return this.props.updateTime(date);
      } else {
        return "";
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    console.log(this.props.showPickerIOS);
    console.log(this.props.location);
    return (
      <View style={styles.outerContainer}>
        <ScrollView style={styles.innerContainer}>
          <Text style={[styles.text, styles.title]}>i want to arrive at</Text>
          <View style={styles.separator}/>
          <View style={styles.textInput}>
            <TextInput
              style={styles.text}
              autoCorrect={true}
              selectTextOnFocus={true}
              onChangeText={this.handleLocationChange.bind(this)}
              onSubmitEditing={this.handleLocationSubmit.bind(this)}
              value={this.props.location}
              defaultValue={"Current Location"}
            />
          </View>
          <View style={styles.separator}/>
          {(Platform.OS === 'ios') && 
            <View>
              <TouchableOpacity onPress={() => this.props.togglePicker()}>
                <Text style={styles.text}>{this.timeString(this.props.time)}</Text>
              </TouchableOpacity>
              {this.props.showPickerIOS &&
                <DatePickerIOS
                  date={new Date(this.props.time)}
                  mode="time"
                  onDateChange={this.handleTimeChange.bind(this)}
                  minuteInterval={10}
                />
              }
            </View>
          }
          {(Platform.OS === 'android') && 
            <View>
              <View title="TimePickerAndroid">
                <TouchableOpacity
                  onPress={this.showPicker.bind(this, {})}>
                  <Text style={styles.text}>{this.timeString(this.props.time)}</Text>
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
    backgroundColor: colors.background,
  },
  innerContainer: {
    marginTop: 20,
    marginBottom: 100,
    backgroundColor: colors.background,
  },
  text: {
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 15 * PixelRatio.getFontScale(),
    height: 40,
    color: colors.primary,
    backgroundColor: colors.background,
    textAlign: 'center'
  },
  textInput: {
    paddingHorizontal: 20,
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
    backgroundColor: colors.background
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
  location: state.form.location,
  time: state.form.time,
  geocode: state.location.geocode,
  distance: state.location.distance,
  current_location: state.location.current_location,
  showPickerIOS: state.form.togglePicker
})

const mapDispatchToProps = dispatch => ({
  updateTime: (time) => {
    dispatch(updateTime(time))
  },
  updateLocation: (data) => {
    dispatch(updateLocation(data))
  },
  togglePicker: () => {
    dispatch(togglePicker())
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