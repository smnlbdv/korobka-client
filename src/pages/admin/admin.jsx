/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, lazy, useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import { AuthContext } from "../../context/authContext.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { notification, Modal } from 'antd';

import api from "../../api/api.js";

import { AdminContext } from "../../context/adminContext.js";
import Loading from "../../components/loading/loading.jsx";
import OneProductPage from "../oneProductPage/oneProductPage.jsx";
import OnePostCard from "../onePostCard/onePostCard.jsx";
const HomePageAdmin = lazy(() => import("../../pages/home/homePageAdmin.jsx"));
const MainPageAdmin = lazy(() => import("../mainPageAdmin/mainPageAdmin.jsx"));
const ProductPage = lazy(() => import("../adminProduct/productPage.jsx"));  

const Admin = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isValidAdmin, setIsValidAdmin] = useState(false);
    const [allProduct, setAllProduct] = useState([]);
    const [dataCategory, setDataCategory] = useState([]);
    const [dataOrder, setDataOrder] = useState([]);
    const [totalPrice, setTotalPrice] = useState([]);
    const { adminFetch, logout } = useContext(AuthContext)
    const [product, setProduct] = useState();
    const [postCard, setPosrCard] = useState();
    const [typesBox, setTypesBox] = useState();
    const nav = useNavigate()

    const { getTypesBox, getProduct, getPostCard} = useContext(AuthContext)
    
    const [apis, contextHolder] = notification.useNotification();
    const [modal, contextHolderEmail] = Modal.useModal();

    useEffect(() => {
      fetchData();
      getAllProduct();
      fetchDataCategory()
      fetchDataOrder()
      getProducts()
    }, []);

    const fetchData = async () => {
      try {
        const response = await adminFetch();
        setIsValidAdmin(response);
      } catch (error) {
        setIsValidAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    const getProducts = async () => {
      const types = await getTypesBox();
      setTypesBox(types)
      const productRes = await getProduct()
      setProduct(productRes)
      const postCardRes = await getPostCard()
      setPosrCard(postCardRes)
    }

    const fetchDataCategory = async () => {
      try {
        await api.get(`/api/admin/stat/category`)
          .then(response => {
            setDataCategory(response.data)
          })
          .catch(response => {
            console.log(response.message);
        });
      } catch (error) {
        console.log(error.message)
      }
    };

    const fetchDataOrder = async () => {
      try {
        await api.get(`/api/admin/stat/order`)
          .then(response => {
            setDataOrder(response.data.order)
            setTotalPrice(response.data.totalPrice)
          })
          .catch(response => {
            console.log(response.message);
        });
      } catch (error) {
        console.log(error.message)
      }
    };

    const getAllProduct = async () => {
      try {
        await api.get("/api/products/all")
          .then((response) => {
            setAllProduct(response.data.products);
          })
          .catch((error) => alert(error.message));
      } catch (error) {
        console.log("Ошибка", error);
      }
    };

    const countDown = (type, message) => {
      if(type === 'success') {
        modal.success({
          title: 'Добавление товара',
          content: `${message}`,
        });
  
      }
      if (type === 'error') {
        modal.error({
          title: 'Добавление товара',
          content: `${message}`,
        });
  
      }
    };

    const openNotification = (placement, text) => {
      apis.success({
        message: <p>{text}</p>,
        placement,
        closeIcon: false,
        duration: 1.5,
      });
    };

    const deleteProductDB = async (id) => {
      try {
        const token = JSON.parse(localStorage.getItem('userData')) || '';
        await api.delete(`/api/admin/delete/${id}`, {
          headers: {
            'Authorization': `${token.token}`,
          }})
          .then((response) => {
            if(response.status === 202) {
              setAllProduct(prevProducts => prevProducts.filter(product => product._id !== id));
              openNotification('bottomRight', 'Товар успешно удален из БД');
            }
          })
          .catch(response => 
            {
              if(response.response.status == 401) {
                logout()
                nav("/api/auth/login");
              }
            }
          );
      } catch (error) {
        console.log("Ошибка", error);
      }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return ( 
      <AdminContext.Provider
        value={{
          contextHolder,
          contextHolderEmail,
          countDown,
          openNotification,
          deleteProductDB,
          dataOrder,
          product,
          postCard,
          typesBox,
          totalPrice,
          allProduct,
          dataCategory,
          setAllProduct
         }}>
        <Routes>
          <Route
              path="/*"
              element={
                <Suspense fallback={<Loading />}>
                  <HomePageAdmin/>
                </Suspense>
              }
            >
              <Route index element={<MainPageAdmin />} />
              <Route path="product-page" element={<ProductPage />} />
              <Route path="page/product" element={<OneProductPage />} />
              <Route path="page/postcard" element={<OnePostCard />} />
              {/* <Route path="page/typesbox" element={<TypesBoxPage />} />
              <Route path="page/review" element={<ReviewsPage />} />
              <Route path="page/users" element={<UsersPage />} /> */}
          </Route>
        </Routes>
      </AdminContext.Provider>
     );
}
 
export default Admin;