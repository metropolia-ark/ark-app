import React from 'react';
import { StyleSheet } from 'react-native';
import { Input, InputProps, Text } from '@ui-kitten/components';
import { FormikValues, useFormikContext } from 'formik';

// Prop types for the FormInput component.
interface FormInputProps extends InputProps {
  name: string;
  label: string;
}

// Input component that hooks into Formik's context to automatically update
// the form data and display error messages. Note: the component requires the
// Formik context to be available, so it only works within a Form component.
const FormInput = ({ name, ...props }: FormInputProps) => {
  const formik = useFormikContext<FormikValues>();
  const isError = formik.touched[name] && formik.errors[name];
  const errorMessage = String(formik.errors[name]);
  return (
    <Input
      {...props}
      value={formik.values[name]}
      onChangeText={formik.handleChange(name)}
      onBlur={formik.handleBlur(name)}
      status={isError ? 'danger' : props.status}
      caption={isError ? () => <Text category="c1" status="danger">{errorMessage}</Text> : props.caption}
      disabled={formik.isSubmitting || props.disabled}
      autoCapitalize="none"
      style={[styles.input, props.style]}
    />
  );
};

const styles = StyleSheet.create({ input: { marginVertical: 12 } });

export { FormInput };
