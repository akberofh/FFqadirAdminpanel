import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteQolbaqMutation, useUpdateQolbaqMutation } from "../slices/qolbaqApiSlice"; // Silme ve Güncelleme fonksiyonlarını ekledik
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [visibleItems, setVisibleItems] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteQolbaq] = useDeleteQolbaqMutation();
  const [updateQolbaq] = useUpdateQolbaqMutation(); // Güncelleme fonksiyonunu kullanıyoruz

  const [editProduct, setEditProduct] = useState(null); // Düzenlenecek ürünü tutan state
  const [formData, setFormData] = useState({
    title: "",
    price: "",
  });

  // Daha fazla ürün yükleme fonksiyonu
  const loadMore = () => {
    setVisibleItems(visibleItems + 8);
  };

  // Ürünleri fetch eden fonksiyon
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://f-fqadir.vercel.app/api/mobile/");
        setData(response.data.allQolbaq || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Ürünler yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Silme butonuna tıklandığında çağrılan fonksiyon
  const handleDelete = async (id) => {
    try {
      await deleteQolbaq(id).unwrap(); // Silme API çağrısı
      setData((prevData) => prevData.filter((item) => item._id !== id)); // Ürün listesini güncelle
      alert("Ürün başarıyla silindi.");
    } catch (error) {
      console.error("Silme işlemi sırasında hata:", error);
      alert("Ürün silinemedi.");
    }
  };

  // Güncelleme işlemi
  const handleUpdate = async () => {
    if (editProduct) {
      const updatedProduct = {
        ...editProduct,
        ...formData, // Formdaki güncellenmiş veriyi kullanıyoruz
      };

      try {
        await updateQolbaq({ id: editProduct._id, ...updatedProduct }).unwrap();
        setData((prevData) => prevData.map(item => item._id === editProduct._id ? updatedProduct : item));
        alert("Ürün başarıyla güncellendi.");
        setEditProduct(null); // Düzenleme bitince formu sıfırla
        setFormData({ title: "", price: "" }); // Formu sıfırla
      } catch (error) {
        console.error("Güncelleme işlemi sırasında hata:", error);
        alert("Ürün güncellenemedi.");
      }
    }
  };

  // Form veri değişikliklerini yönetmek
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="w-[97%] mx-auto p-4 sm:p-6">
      {/* Yükleniyor Durumu */}
      {isLoading && <p className="text-center text-gray-500 dark:text-gray-300">Ürünler yükleniyor...</p>}

      {/* Hata Durumu */}
      {error && <p className="text-center text-red-600 dark:text-red-400">{error}</p>}

      {/* Ürün Listesi */}
      <button 
  type="button" 
  onClick={() => navigate('/')} 
  className="px-6 py-3 bg-red-800 text-white rounded-lg bottom-11 hover:bg-green-700 transition-colors duration-200 mt-2 mb-2 mx-2"
>
  Məhsul Əlavə Et
</button>

      <div className="grid gap-4 sm:gap-6 dark:text-white grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        
        {data.length > 0 &&
          data.slice(0, visibleItems).map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-lg rounded-lg dark:bg-gray-800 border overflow-hidden p-4 sm:p-6 flex flex-col items-center transition-transform transform hover:scale-105 relative"
            >
              {/* Ürün Görseli */}
              {product.photo && (
                <img
                  src={`data:image/jpeg;base64,${product.photo}`}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                  loading="lazy"
                />
              )}

              {/* Ürün Başlık ve Fiyat */}
              <h3 className="text-sm sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white text-center h-10 overflow-hidden">
                {product.title}
              </h3>
              <h4 className="text-sm sm:text-lg font-semibold mb-4 dark:text-white text-gray-800">
                {product.price}₼
              </h4>

              {/* Silme Butonu */}
              <button
                onClick={() => handleDelete(product._id)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Sil
              </button>

              {/* Güncelleme Butonu */}
              <button
                onClick={() => {
                  setEditProduct(product);
                  setFormData({ title: product.title, price: product.price }); // Formu mevcut değerlerle doldur
                }}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Güncelle
              </button>
              
            </div>
          ))}
      </div>

      

      {/* Daha Fazla Göster Butonu */}
      {visibleItems < data.length && !isLoading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Daha Fazla Göster
          </button>
          
        </div>
      )}

      {/* Güncelleme Formu */}
      {editProduct && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Ürün Güncelleme</h3>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mb-4 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Yeni Başlık"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="mb-4 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Yeni Fiyat"
          />
          <button
            onClick={handleUpdate}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Güncelle
          </button>

        </div>
        
      )}
    </div>
  );
};

export default Cart;
