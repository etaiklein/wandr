import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Form,
  Separator,InputField, LinkField,
  SwitchField, PickerField,DatePickerField,TimePickerField
} from 'react-native-form-generator';

export default class FormView extends Component {
  constructor(props) {
    super(props);
  }

  handleFormChange(formData){
    this.props.actions.updateForm(formData);
  }

  handleSubmit(){
    this.props.actions.submitForm();
    this.props.next();
  }

  render() {
    const { routes, next } = this.props;

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