import useCreateProduct from '@/hooks/product/useCreateProduct';
import { useAppForm } from '@/hooks/useAppForm';
import { createProductSchema } from '@/schemas/product';
import toast from 'react-hot-toast';

export default function FormAddProduct() {
  const { mutateAsync, isPending } = useCreateProduct();
  const form = useAppForm({
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      description: '',
      specification: '',
      videoUrl: '',
      imageOne: '',
      imageTwo: '',
      imageThree: '',
      imageFour: '',
    },
    validators: {
      onChange: createProductSchema,
    },
    onSubmit: async ({
      value: {
        description,
        name,
        price,
        specification,
        stock,
        videoUrl,
        imageFour,
        imageOne,
        imageThree,
        imageTwo,
      },
    }) => {
      const id = toast.loading('Submitting new product data...');
      const images = [imageOne, imageTwo, imageThree, imageFour].filter(
        (v) => v !== '',
      );
      try {
        await mutateAsync({
          images,
          description,
          name,
          price: parseFloat(price.toString()),
          specification,
          stock: parseInt(stock.toString()),
          videoUrl,
        });
        toast.success('New product added', { id });
        form.reset();
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message, { id });
        }
      }
    },
  });
  return (
    <fieldset disabled={isPending}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="my-8 space-y-8"
      >
        <form.AppField name="name">
          {(field) => <field.ProductTextArea label="Product's Name" />}
        </form.AppField>
        <div className="flex items-center">
          <form.AppField name="price">
            {(field) => (
              <field.ProductInput type="number" label="Product's Price" />
            )}
          </form.AppField>
          <form.AppField name="stock">
            {(field) => (
              <field.ProductInput type="number" label="Product's Stock" />
            )}
          </form.AppField>
          <form.AppField name="videoUrl">
            {(field) => <field.ProductTextArea label="Product's Video" />}
          </form.AppField>
        </div>
        <div className="grid grid-cols-2">
          <form.AppField name="imageOne">
            {(field) => (
              <field.ProductInput type="text" label="Product's Image" />
            )}
          </form.AppField>
          <form.AppField name="imageTwo">
            {(field) => (
              <field.ProductInput type="text" label="Product's Image" />
            )}
          </form.AppField>
          <form.AppField name="imageThree">
            {(field) => (
              <field.ProductInput type="text" label="Product's Image" />
            )}
          </form.AppField>
          <form.AppField name="imageFour">
            {(field) => (
              <field.ProductInput type="text" label="Product's Image" />
            )}
          </form.AppField>
        </div>
        <form.AppField name="description">
          {(field) => <field.ProductTextArea label="Product's Description" />}
        </form.AppField>
        <form.AppField name="specification">
          {(field) => <field.ProductTextArea label="Product's Specification" />}
        </form.AppField>
        <form.AppForm>
          <form.ProductSubmitButton />
        </form.AppForm>
      </form>
    </fieldset>
  );
}
