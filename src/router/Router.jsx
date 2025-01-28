import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login/Login";
import Home from "../pages/home/Home";
import Cart from "../redux/Cart/Cart";
import Baxim from "../Catagory/Baxim";
import AddNewTodo from "../redux/addTodo/AddNewTodo";
import Catagory from "../Catagory/Catagory";
import CatagoryAdd from "../Catagory/CatagoryAdd";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}  />
        <Route path="/login" element={<Login />} />
        <Route path="/catagory/:catagory" element={<Baxim />} />
        <Route path="/addtodo" element={<AddNewTodo />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/kategori" element={<Catagory />} />
        <Route path="/catagoryadd" element={<CatagoryAdd />} />
        </Routes>
    </BrowserRouter>
  );
};

export default Router;
