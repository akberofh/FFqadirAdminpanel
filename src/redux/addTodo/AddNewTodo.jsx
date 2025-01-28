import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from "../../redux/slices/authSlice";
import { useLogoutMutation } from "../../redux/slices/usersApiSlice";
import { useAddQolbaqMutation } from '../slices/qolbaqApiSlice';
import styles from './AddNewTodo.module.css';

const AddNewTodo = () => {
  const [title, setTitle] = useState('');
  const [catagory, setCatagory] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null); // New state for photo
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addQolbaq] = useAddQolbaqMutation();
  const [logoutApiCall] = useLogoutMutation();


  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('catagory', catagory);
      if (photo) formData.append('photo', photo);

      const newQolbaq = await addQolbaq(formData).unwrap();

      setTimeout(() => {
        dispatch({ type: 'todo/addTodo', payload: newQolbaq });
      }, 1000);

      navigate('/cart');
    } catch (err) {
      console.error('Failed to add the todo:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Yeni Məhsul</h2>
      <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
        <div className={styles.inputGroup}>
          <label htmlFor="title">Ad:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="catagory">Kategoriya:</label>
          <select
            id="catagory"
            value={catagory}
            onChange={(e) => setCatagory(e.target.value)}
            className={styles.input}
          >
            <option value="">Seçin...</option>
            <option value="Pubg">Pubg</option>
            <option value="Fanlar">Fanlar</option>
            <option value="Qulaqlıqlar">Qulaqlıqlar</option>
            <option value="Adapterlər">Adapterlər</option>
            <option value="Powerbanklar">Powerbanklar</option>
            <option value="Keyslər">Keyslər</option>
            <option value="Ekran qoruyucular">Ekran qoruyucular</option>
            <option value="USB naqillər">USB naqillər</option>
            <option value="Digər">Digər</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="price">Qiymət:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="photo">Şəkil:</label>
          <input
            type="file"
            id="photo"
            onChange={handlePhotoChange}
            className={styles.fileInput}
          />
        </div>
        <div className={styles.buttons}>
          <button type="submit" className={styles.submitButton}>Yükləyin</button>
          <button type="button" onClick={() => navigate('/cart')} className={styles.cancelButton}>Məhsullar</button>
          <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Çıkış
        </button>

        </div>
      </form>
    </div>
  );
};

export default AddNewTodo;
