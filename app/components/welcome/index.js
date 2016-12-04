'use strict';

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { updateLocation, updateTime, submitForm, togglePicker, shouldShowQueryResults } from '../../redux/form/action-creators';
import { fetchGeocode, fetchDistance, updateCurrentLocation, setGeocode } from '../../redux/location/action-creators';
import {colors} from '../../lib/colors';
import {travelTimePlusFive, toTimeString} from '../../lib/time';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import BackgroundGeolocation from "react-native-background-geolocation";
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
  Image,
  Dimensions,
  DatePickerIOS} from 'react-native';
var PushNotification = require('react-native-push-notification');

import { Form,
  Separator,InputField, LinkField,
  SwitchField, PickerField,DatePickerField,TimePickerField
} from 'react-native-form-generator';


class Welcome extends Component {

  componentWillMount() {
    BackgroundGeolocation.on('location', this.onLocation);
  }

  componentWillUnmount() {
    BackgroundGeolocation.on('location', this.onLocation);
  }

  onLocation(position) {
    let currentLocation = this.polylineFormat(position.coords);
    this.props.updateCurrentLocation(currentLocation);
    if (!this.props.geocodeLoaded) {return}
    let route = [this.polylineFormat(this.props.geocode), currentLocation]
    this.props.fetchDistance(route);
    this.setPushNotificationSchedule();
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
      this.props.shouldShowQueryResults(true);
    });
  }

  handleLocationSubmit(event){
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchGeocode(this.props.location);
      this.props.updateLocation(event);
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
      
      if (!this.props.geocodeLoaded || this.props.location === "Current Location") {
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

  renderTimeWithIcon() {
    return <Fumi
      label={'arrive by'}
      iconClass={Icon}
      iconName={'bell'}
      iconColor={colors.primary}
      // TextInput props
      editable={false}
      value={toTimeString(this.props.time)}
      _focus={() => Function.prototype}
    />;
  }

  querySelected(query) {
    this.props.updateLocation(query.place_name);
    this.props.shouldShowQueryResults(false);
    this.props.setGeocode(query.geometry.coordinates);
  }

  currentLocationSelected() {
    this.props.shouldShowQueryResults(false);
    this.props.updateLocation('Current Location');
  }
  
  renderQueries() {
    let queries = [];
    if (!this.props.queries){return}
    queries.push(
      <TouchableOpacity key={'Current Location'} onPress={() => this.currentLocationSelected()} style={[styles.listItem, (this.props.location == "Current Location") ? styles.selectedListItem : styles.listItem]}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.listText, (this.props.location == "Current Location") ? styles.selectedQuery : styles.listText]}>
          <Icon
            name='map-pin'
            size={20}
            color={colors.CTA}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          Current Location
        </Text>
      </TouchableOpacity>
    )
    for (let query of this.props.queries){
      queries.push(
        <TouchableOpacity key={query.place_name} style={[styles.listItem, (this.props.location != "Current Location" && this.props.geocode.latitude == query.geometry.coordinates[0]) ? styles.selectedListItem : styles.listItem]} onPress={() => this.querySelected(query)}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.listText, (this.props.location != "Current Location" && this.props.geocode.latitude == query.geometry.coordinates[0]) ? styles.selectedQuery : styles.listText]}>
            {query.place_name}
          </Text>
        </TouchableOpacity>
      )
    }
    return <View style={styles.queryList}>{queries}</View>
  }

  render() {
    return (
      <Image source={require('../../../images/followme.jpg')} style={styles.outerContainer}>
        <ScrollView automaticallyAdjustContentInsets={false} style={styles.innerContainer}>
          <View >
            <Fumi
              label={'walk to'}
              iconClass={Icon}
              iconName={'search'}
              iconColor={colors.primary}
              // TextInput props
              autoCapitalize={'none'}
              autoCorrect={true}
              selectTextOnFocus={true}
              numberOfLines={1}
              onChangeText={this.handleLocationChange.bind(this)}
              onSubmitEditing={this.handleLocationSubmit.bind(this)}
              value={this.props.location}
              defaultValue={"Current Location"}
              onFocus={() => this.props.shouldShowQueryResults(true)}
            />
          </View>
          <View style={styles.queryContainer}>
          {this.props.showLocationResults && this.renderQueries()}
          </View>
          <View style={styles.separator}/>
          {(Platform.OS === 'ios') && 
            <View>
              <TouchableOpacity onPress={() => this.props.togglePicker()}>
                {this.renderTimeWithIcon()}
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
            <TouchableOpacity onPress={this.showPicker.bind(this, {})}>
              {this.renderTimeWithIcon()}
            </TouchableOpacity>
          </View>
          }
        </ScrollView>
        <View style={styles.buttonContainer} >
          <Button style={styles.button} onPress={this.handleSubmit.bind(this)}>
            <Text style={styles.buttonText}>Wander!</Text>
          </Button>
        </View>
      </Image>
    );
  }
}


const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    textAlign: 'center'
  },
  outerContainer: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: null,
    height: null,
    backgroundColor: colors.transparent,
  },
  innerContainer: {
    flexDirection: 'row',
    flex: 0.9,
    marginTop: 20,
    backgroundColor: colors.transparent,
  },
  text: {
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 24,
    paddingVertical: 10,
    color: colors.primary,
    backgroundColor: colors.transparent,
    textAlign: 'left'
  },
  listItem: {
    borderBottomWidth: 1,
    borderColor: colors.primary,
  },
  selectedListItem: {
    borderColor: colors.CTA,
  },
  textInput: {
    borderColor: 'grey', 
    backgroundColor: 'white',
    borderWidth: 1,
  },
  textInputText: {
    height: 45,
    width: Dimensions.get('window').width - 20,
  },
  listText: {
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 20,
    color: colors.primary,
    height: 30,
  },
  selectedQuery: {
    color: colors.CTA
  },
  queryContainer: {
    width: Dimensions.get('window').width - 10,
    backgroundColor: colors.white,
  },
  queryList: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  separator: {
    marginTop: 30
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 0.1,
  },
  button: {
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: colors.CTA,
    backgroundColor: colors.transparent
  },
  buttonText: {
    color: colors.CTA,
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  }
})

const mapStateToProps = state => ({
  location: state.form.location,
  queries: state.location.queries,
  time: state.form.time,
  geocode: state.location.geocode,
  geocodeLoaded: state.location.geocodeLoaded,
  distance: state.location.distance,
  currentLocation: state.location.currentLocation,
  currentLocationSet: state.location.currentLocationSet,
  showPickerIOS: state.form.togglePicker,
  showLocationResults: state.form.locationResultsVisible
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
  shouldShowQueryResults: (bool) => {
    dispatch(shouldShowQueryResults(bool))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);