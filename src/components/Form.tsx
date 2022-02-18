import React, { ReactNode } from 'react';
import { FormikConfig, FormikHelpers, FormikProvider, FormikValues, useFormik } from 'formik';
import { View } from 'react-native';

// Helper type for the 'actions' parameter of the onSubmit function
export type FormActions<T extends FormikValues> = FormikHelpers<T>;

// Prop types for the Form component. It expects one generic parameter,
// which will be inferred automatically when the component is used somewhere.
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
