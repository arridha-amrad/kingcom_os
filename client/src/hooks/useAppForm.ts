import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import {
  Select,
  SubscribeButton,
  TextArea,
  TextField,
} from '../components/demo.FormComponents';
import {
  AuthSubscribeBtn,
  AuthTextField,
} from '@/components/Forms/auth/auth.FormComponents';
import {
  ProductInput,
  ProductSubmitButton,
  ProductTextArea,
} from '@/components/Forms/products/product.FormComponent';

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    AuthTextField,
    ProductTextArea,
    ProductInput,
  },
  formComponents: {
    SubscribeButton,
    AuthSubscribeBtn,
    ProductSubmitButton,
  },
  fieldContext,
  formContext,
});
