import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteQolbaqMutation, useUpdateQolbaqMutation } from "../slices/qolbaqApiSlice";
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [visibleItems, setVisibleItems] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("date");

  const [deleteQolbaq] = useDeleteQolbaqMutation();
  const [updateQolbaq] = useUpdateQolbaqMutation();

  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
  });

  const loadMore = () => {
    setVisibleItems(visibleItems + 8);
  };

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

  // Ürün silme
  const handleDelete = async (id) => {
    try {
      await deleteQolbaq(id).unwrap();
      setData((prevData) => prevData.filter((item) => item._id !== id));
      alert("Ürün başarıyla silindi.");
    } catch (error) {
      console.error("Silme işlemi sırasında hata:", error);
      alert("Ürün silinemedi.");
    }
  };

  // Ürün güncelleme
  const handleUpdate = async () => {
    if (editProduct) {
      const formData = new FormData();
      formData.append("title", editProduct.title); // Doğru şekilde ekle
      formData.append("price", editProduct.price);
  
      try {
        const response = await updateQolbaq({
          id: editProduct._id,
          formData, // Doğru formatta gönder
        }).unwrap();
  
        // Backend'den dönen güncellenmiş ürünü state'e yansıt
        setData((prevData) =>
          prevData.map((item) =>
            item._id === editProduct._id ? response : item
          )
        );
  
        alert("Ürün başarıyla güncellendi.");
        setEditProduct(null);
        setFormData({ title: "", price: "" });
      } catch (error) {
        console.error("Güncelleme işlemi sırasında hata:", error);
        alert("Ürün güncellenemedi.");
      }
    }
  };
  
  


  
  // Form değişikliklerini yönetme
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Ürünleri filtreleme (Arama)
  const filteredData = data.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ürünleri sıralama
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortType === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortType === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortType === "price") {
      return a.price - b.price;
    }
    return 0;
  });

  return (
    <div className="w-[97%] mx-auto p-4 sm:p-6">
      {/* Arama ve Sıralama */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/3"
        />
        <div className="flex gap-2">
          <button onClick={() => setSortType("date")} className="px-4 py-2 bg-gray-700 text-white rounded-lg">
            Tarihe Göre
          </button>
          <button onClick={() => setSortType("title")} className="px-4 py-2 bg-gray-700 text-white rounded-lg">
            Alfabeye Göre
          </button>
          <button onClick={() => setSortType("price")} className="px-4 py-2 bg-gray-700 text-white rounded-lg">
            Fiyata Göre
          </button>
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="px-4 py-3 bg-red-800 text-white rounded-lg bottom-11 hover:bg-green-700 transition-colors duration-200 mt-2 mb-2 mx-2"
          >
            Məhsul Əlavə Et
          </button>
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {sortedData.slice(0, visibleItems).map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-lg rounded-lg border overflow-hidden p-4 sm:p-6 flex flex-col items-center transition-transform transform hover:scale-105 relative"
          >
            {product.photo && (
              <img
                src={`data:image/jpeg;base64,${product.photo}`}
                alt={product.title}
                className="w-full h-40 object-cover rounded-md mb-4"
                loading="lazy"
              />
            )}
            <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
            <h4 className="text-lg font-semibold mb-4">{product.price}₼</h4>
            <button onClick={() => handleDelete(product._id)} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg">
              Sil
            </button>
            <button
              onClick={() => {
                setEditProduct(product);
                setFormData({ title: product.title, price: product.price });
              }}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Güncelle
            </button>
          </div>
        ))}
      </div>

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

      {/* Güncelleme Modalı */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px]">
            <h2 className="text-xl font-bold mb-4">Ürünü Güncelle</h2>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
              placeholder="Başlık"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
              placeholder="Fiyat"
            />
            <div className="flex justify-between">
              <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                Kaydet
              </button>
              <button onClick={() => setEditProduct(null)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
