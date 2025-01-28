import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useGetCatagoryQuery,
} from '../redux/slices/catagoryApiSlice';
import {
  setCatagory,
} from '../redux/slices/catagorySlice';

const Catagory = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetCatagoryQuery();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
    if (data?.allCatagory) {
      dispatch(setCatagory(data.allCatagory));
    }
  }, [navigate, userInfo, data, dispatch]);

  if (isLoading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error.message}</p>;
  if (!data?.allCatagory) {
    return <p>Kategori bulunamadı.</p>;
  }

  const categoryList = data.allCatagory;

  return (
    <div className="dark:bg-black bg-white w-full py-4 border-b flex justify-center items-center">
      <div className="w-[97%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categoryList.map((category) => (
          <div
            key={category._id}
            className="flex flex-col justify-center items-center"
          >
            <a
              href={`/catagory/${category.title}`}
              className="text-center hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`data:image/jpeg;base64,${category.photo}`}
                alt={category.title}
                className="w-32 h-32 object-cover rounded-lg shadow-lg mb-2 border-2 border-gray-300"
              />
              <p className="text-sm font-medium dark:text-white text-gray-700">
                {category.title}
              </p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catagory;
