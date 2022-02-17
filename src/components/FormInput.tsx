import React from 'react';
import { StyleSheet } from 'react-native';
import { Input, InputProps, Text } from '@ui-kitten/components';
import { useFormikContext } from 'formik';

type FormValues = Record<string, never>;

interface FormInputProps extends InputProps {
  name: string;
  label: string;
}

// Input component that hooks into Formik's context to automatically update
// the form data and display error messages. Note: the component requires the
// Formik context to be available, so it only works within a Formik component.
const FormInput = ({ name, ...props }: FormInputProps) => {
  const formik = useFormikContext<FormValues>();
  const showError = formik.touched[name] && formik.errors[name];
  return (
    <Input
      {...props}
      value={formik.values[name]}
      onChangeText={formik.handleChange(name)}
      onBlur={formik.handleBlur(name)}
      status={showError ? 'danger' : props.status}
      caption={showError ? () => <Text category="c1" status="danger">{formik.errors[name]}</Text> : props.caption}
      disabled={formik.isSubmitting || props.disabled}
      autoCapitalize="none"
      style={[styles.input, props.style]}
    />
  );
};
const styles = StyleSheet.create({ input: { marginVertical: 12 } });

export default FormInput;
