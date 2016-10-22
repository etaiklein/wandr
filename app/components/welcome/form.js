import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
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
      <View>
        <Form
          ref='welcomeForm'
          onChange={this.handleFormChange.bind(this)}>
          <Text>I need to arrive at</Text>
          <InputField 
               ref='location' 
               placeholder='Location'/>
          <Text>By</Text>
          <TimePickerField 
               ref='time' />
        </Form>
        <TouchableOpacity onPress={this.handleSubmit.bind(this)}>
          <Text>Wander!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}