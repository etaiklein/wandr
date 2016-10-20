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

  render() {
    const { routes, handleSubmit } = this.props;
    return ( 
      <Form
        ref='welcomeForm'>
        <Text>I need to arrive at</Text>
        <InputField 
             ref='location' 
             placeholder='Location'/>
        <Text>By</Text>
        <TimePickerField 
             ref='time' />
        <View>
          <Text>Wander!</Text>
        </View>
      </Form>
    );
  }

}