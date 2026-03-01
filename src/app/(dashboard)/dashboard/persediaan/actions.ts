'use server';

import { deleteFile, uploadFile } from '@/actions/storage-action';
import { createClient } from '@/lib/supabase/server';
import { StockFormState } from '@/types/stock';
import { stockSchema } from '@/validations/stock-validation';

export async function createStock(prevState: StockFormState, formData: FormData) {
  let validatedFields = stockSchema.safeParse({
    nama: formData.get('nama'),
    deskripsi: formData.get('deskripsi'),
    harga_beli: parseFloat(formData.get('harga_beli') as string),
    harga_jual: parseFloat(formData.get('harga_jual') as string),
    kategori: formData.get('kategori'),
    jumlah: parseInt(formData.get('jumlah') as string),
    image_url: formData.get('image_url'),
    is_available: formData.get('is_available') === 'true' ? true : false,
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  if (validatedFields.data.image_url instanceof File) {
    const { errors, data } = await uploadFile(
      'images',
      'stocks',
      validatedFields.data.image_url,
    );
    if (errors) {
      return {
        status: 'error',
        errors: {
          ...prevState.errors,
          _form: [...errors._form],
        },
      };
    }

    validatedFields = {
      ...validatedFields,
      data: {
        ...validatedFields.data,
        image_url: data.url,
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('stocks').insert({
    nama: validatedFields.data.nama,
    deskripsi: validatedFields.data.deskripsi,
    harga_beli: validatedFields.data.harga_beli,
    harga_jual: validatedFields.data.harga_jual,
    kategori: validatedFields.data.kategori,
    jumlah: validatedFields.data.jumlah,
    image_url: validatedFields.data.image_url,
    is_available: validatedFields.data.is_available,
  });

  if (error) {
    return {
      status: 'error',
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: 'success',
  };
}

export async function updateStock(prevState: StockFormState, formData: FormData) {
  let validatedFields = stockSchema.safeParse({
    nama: formData.get('nama'),
    deskripsi: formData.get('deskripsi'),
    harga_beli: parseFloat(formData.get('harga_beli') as string),
    harga_jual: parseFloat(formData.get('harga_jual') as string),
    kategori: formData.get('kategori'),
    jumlah: parseInt(formData.get('jumlah') as string),
    image_url: formData.get('image_url'),
    is_available: formData.get('is_available') === 'true' ? true : false,
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  if (validatedFields.data.image_url instanceof File) {
    const oldImageUrl = formData.get('old_image_url') as string;
    const { errors, data } = await uploadFile(
      'images',
      'stocks',
      validatedFields.data.image_url,
      oldImageUrl.split('/images/')[1],
    );
    if (errors) {
      return {
        status: 'error',
        errors: {
          ...prevState.errors,
          _form: [...errors._form],
        },
      };
    }

    validatedFields = {
      ...validatedFields,
      data: {
        ...validatedFields.data,
        image_url: data.url,
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('stocks')
    .update({
      nama: validatedFields.data.nama,
      deskripsi: validatedFields.data.deskripsi,
      harga_beli: validatedFields.data.harga_beli,
      harga_jual: validatedFields.data.harga_jual,
      kategori: validatedFields.data.kategori,
      jumlah: validatedFields.data.jumlah,
      image_url: validatedFields.data.image_url,
      is_available: validatedFields.data.is_available,
    })
    .eq('id', formData.get('id'));

  if (error) {
    return {
      status: 'error',
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: 'success',
  };
}

export async function deleteStock(prevState: StockFormState, formData: FormData) {
  const supabase = await createClient();
  const image = formData.get('image_url') as string;
  const { status, errors } = await deleteFile(
    'images',
    image.split('/images/')[1],
  );

  if (status === 'error') {
    return {
      status: 'error',
      errors: {
        ...prevState.errors,
        _form: [errors?._form?.[0] ?? 'Unknown error'],
      },
    };
  }

  const { error } = await supabase
    .from('stocks')
    .delete()
    .eq('id', formData.get('id') as string);

  if (error) {
    return {
      status: 'error',
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return { status: 'success' };
}
