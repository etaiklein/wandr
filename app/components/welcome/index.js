'use strict';

import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { updateForm, submitForm } from '../../redux/form/action-creators'
import { fetchGeocode, fetchDistance, updateCurrentLocation } from '../../redux/location/action-creators'

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
    console.log("mount watch");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.updateCurrentLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      //stuff dependent on position change goes here
      this.props.updateCurrentLocation([position.coords.latitude, position.coords.longitude]);
    });
  }

  componentWillUnmount() {
    console.log("unmount watch");
    navigator.geolocation.clearWatch(this.watchID);
  }

  handleFormChange(formData){
    this.props.updateForm(formData);
    this.props.fetchGeocode(this.props.form.location);
  }

  polylineFormat(ary){
    return [ary[1], ary[0]]
  }

  handleSubmit(){
    let route = [this.polylineFormat(this.props.geocode), this.polylineFormat(this.props.current_location)] //Google Encoded Polyline format
    this.props.fetchDistance(route); 

    if (this.props.form.time && this.props.form.location) {

      Actions.journey();

    } else if (this.props.form.location) {

      let formData = Object.assign({}, this.props.form, {
        time: new Date(Date.now() + 30*60000)
      });
      this.props.updateForm(formData);
      Actions.journey();

    } else {

      alert("please enter a valid address");
    }
  }

  render() {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
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
              placeholder='Location'/>
            <View style={styles.separator}/>
            <TimePickerField 
              date={new Date(Date.now() + 30*60000)}
              dateTimeFormat={(time) => time.toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}
              valueStyle={styles.text}
              ref='time'/>
            <View style={styles.separator__big}/>
          </Form>
        </View>
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
    fontSize: 40,
    textAlign: 'center'
  },
  outerContainer: {
    flex: 1,
  },
  innerContainer: {
    marginTop: 150,
    marginHorizontal: 20,
  },
  text: {
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 25,
    color: 'black',
    textAlign: 'right'
  },
  separator: {
    marginTop: 30
  },
  separator__big: {
    marginTop: 60
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
  },
  buttonText: {
    color: '#007aff',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 20,
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
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);