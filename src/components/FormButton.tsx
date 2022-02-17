import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps, Spinner } from '@ui-kitten/components';
import { useFormikContext } from 'formik';

type FormValues = Record<string, never>;

interface FormButtonProps extends ButtonProps {
  children: string;
}

// Button component that hooks into Formik's context to automatically submit
// the form and display the loading status. Note: the component requires the
// Formik context to be in scope, so it only works within a Formik component.
const FormButton = ({ children, ...props }: FormButtonProps) => {
  const formik = useFormikContext<FormValues>();
  return (
    <Button
      {...props}
      disabled={formik.isSubmitting || props.disabled}
      onPress={formik.submitForm || props.onPress}
      accessoryLeft={formik.isSubmitting ? () => <Spinner size="tiny" /> : props.accessoryLeft}
      style={[styles.button, props.style]}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({ button: { marginVertical: 12 } });

export default FormButton;
