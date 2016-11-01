'use strict';

import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { updateForm, submitForm } from '../../redux/form/action-creators'
import { fetchGeocode, fetchDistance } from '../../redux/location/action-creators'

import { Form,
  Separator,InputField, LinkField,
  SwitchField, PickerField,DatePickerField,TimePickerField
} from 'react-native-form-generator';


class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  handleFormChange(formData){
    this.props.updateForm(formData);
  }

  handleSubmit(){
    this.props.dispatch(fetchGeocode(this.props.form.location));
    // this.props.dispatch(fetchDistance(this.props.location.geocode));
    Actions.journey();
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
  location: state.location
})

const mapDispatchToProps = dispatch => ({
  updateForm: (data) => {
    dispatch(updateForm(data))
  },
  submitForm: () => {
    dispatch(submitForm())
  },
  fetchGeocode,
  fetchDistance
})

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);