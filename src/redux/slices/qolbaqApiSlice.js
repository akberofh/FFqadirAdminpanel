import { apiSlice } from './apiSlice';

const TODOS_URL = '/api/mobile';

export const qolbaqApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQolbaq: builder.query({
      query: () => ({
        url: `${TODOS_URL}/`,
      }),
    }),
    addQolbaq: builder.mutation({
      query: (qolbaq) => ({
        url: `${TODOS_URL}/`,
        method: 'POST',
        body: qolbaq,
      }),
    }),
    updateQolbaq: builder.mutation({
         query: ({ id, formData }) => ({
          url: `${TODOS_URL}/${id}`, // ID'yi URL'ye ekle
          method: 'PUT',
          body: formData, // FormData'yı body olarak gönder
        }),
    }),
    deleteQolbaq: builder.mutation({
      query: (id) => ({
        url: `${TODOS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetQolbaqQuery, useAddQolbaqMutation, useDeleteQolbaqMutation, useUpdateQolbaqMutation } = qolbaqApiSlice;
