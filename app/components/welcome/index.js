'use strict';

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { updateLocation, updateTime, submitForm, togglePicker } from '../../redux/form/action-creators';
import { fetchGeocode, fetchDistance, updateCurrentLocation, setGeocode } from '../../redux/location/action-creators';
import {colors} from '../../lib/colors';
import {travelTimePlusFive, toTimeString} from '../../lib/time';
import {Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  InteractionManager, 
  PixelRatio, 
  TimePickerAndroid, 
  Platform, 
  TextInput, 
  DatePickerIOS} from 'react-native';
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
        let currentLocation = this.polylineFormat(position.coords);
        this.props.updateCurrentLocation(currentLocation);
        if (this.props.geocode.latitude === "") {return}
        let route = [this.polylineFormat(this.props.geocode), currentLocation]
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
      this.props.fetchGeocode(event);
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
    let time = travelTimePlusFive(this.props.time, this.props.distance);
    PushNotification.cancelAllLocalNotifications() //clear
    if (new Date(time) > new Date())
      PushNotification.localNotificationSchedule({
        message: "time to go!", // (required)
        date: new Date(time)
      });
  }

  handleSubmit(){
    InteractionManager.runAfterInteractions(() => {
      
      let route = [this.polylineFormat(this.props.geocode), this.polylineFormat(this.props.currentLocation)]
      
      if (this.props.geocode.latitude === '' || this.props.location === "Current Location") {
        this.props.setGeocode(this.polylineFormat(this.props.currentLocation));
        route[0] = this.polylineFormat(this.props.currentLocation);
      }

      this.props.fetchDistance(route); 
      this.setPushNotificationSchedule();
      Actions.journey();
    });

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

  renderQueries() {
    let queries = [];
    if (!this.props.queries){return}
    for (let query of this.props.queries){
      queries.push(
        <TouchableOpacity key={query.place_name} style={styles.queryContainer} onPress={() => this.props.setGeocode(query.geometry.coordinates)}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.listText, (this.props.geocode.latitude == query.geometry.coordinates[0]) ? styles.selectedQuery : styles.listText]}>
            {query.place_name}
          </Text>
        </TouchableOpacity>
      )
    }
    return <View style={queries.length > 1 && styles.queryList}>{queries}</View>
  }

  render() {
    return (
      <View style={styles.outerContainer}>
        <ScrollView style={styles.innerContainer}>
          <Text style={[styles.text, styles.title]}>i want to arrive at</Text>
          <View style={styles.separator}/>
          <View style={styles.textInput}>
            <TextInput
              style={[styles.text, styles.height]}
              autoCorrect={true}
              selectTextOnFocus={true}
              numberOfLines={1}
              onChangeText={this.handleLocationChange.bind(this)}
              onSubmitEditing={this.handleLocationSubmit.bind(this)}
              value={this.props.location}
              defaultValue={"Current Location"}
            />
          </View>
          {this.renderQueries()}
          <View style={styles.separator}/>
          {(Platform.OS === 'ios') && 
            <View>
              <TouchableOpacity onPress={() => this.props.togglePicker()}>
                <Text style={styles.text}>{toTimeString(this.props.time)}</Text>
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
            <TouchableOpacity
              onPress={this.showPicker.bind(this, {})}>
              <Text style={styles.text}>{toTimeString(this.props.time)}</Text>
            </TouchableOpacity>
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
    fontSize: 12 * PixelRatio.getFontScale(),
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
    fontSize: 12 * PixelRatio.getFontScale(),
    paddingVertical: 10,
    color: colors.primary,
    backgroundColor: colors.background,
    textAlign: 'center'
  },
  height: {
    height: 45,
  },
  listText: {
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 8 * PixelRatio.getFontScale(),
    color: colors.primary,
  },
  selectedQuery: {
    color: colors.CTA
  },
  queryContainer: {
  },
  queryList: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.primary,
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
    paddingTop: 10,
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
  queries: state.location.queries,
  time: state.form.time,
  geocode: state.location.geocode,
  distance: state.location.distance,
  currentLocation: state.location.currentLocation,
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