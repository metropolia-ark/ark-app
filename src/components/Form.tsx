import React, { ReactNode } from 'react';
import { FormikConfig, FormikHelpers, FormikProvider, FormikValues, useFormik } from 'formik';
import { View } from 'react-native';

export type FormActions<T extends FormikValues> = FormikHelpers<T>;

interface FormProps<T extends FormikValues> {
  initialValues: FormikConfig<T>['initialValues'];
  schema: FormikConfig<T>['validationSchema'];
  onSubmit: FormikConfig<T>['onSubmit'];
  children: ReactNode;
}

// Form component that creates a Formik context to manage form data and
// enable FormInput and FormButton components to hook into its context.
const Form = <T extends FormikValues>({ initialValues, schema, onSubmit, children }: FormProps<T>) => {
  const formikConfig: FormikConfig<T> = { initialValues, validationSchema: schema, onSubmit };
  const formik = useFormik(formikConfig);
  return (
    <FormikProvider value={formik}>
      <View>{children}</View>
    </FormikProvider>
  );
};

export { Form };
