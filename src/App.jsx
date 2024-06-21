/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./context/authContext.js";
import { notification, Modal } from 'antd';
import './libs/ant.css'
import { useDispatch, useSelector } from "react-redux";
import { addProductFavorite } from "./store/likedSlice.js";
import { addProductCart } from "./store/cartSlice.js";
import { addConstructorProfile, addInfoProfile, addProductProfile, setIsAuth, setRole, setUserId } from "./store/profileSlice.js";

import Loading from "./components/loading/loading.jsx";
import api from './api/api.js'
import ResetPassword from "./components/resetPassword/resetPassword.jsx";

const delayedImport = (component, delay) => new Promise(resolve => setTimeout(() => resolve(component), delay));
const lazyWithDelay = (importFunction, delay) => lazy(() => delayedImport(importFunction(), delay));

const HomePage = lazyWithDelay(() => import("./pages/home/homePage.jsx"), 600);
const Auth = lazyWithDelay(() => import("./pages/auth/auth.jsx"), 600);
const Main = lazyWithDelay(() => import("./pages/main/main.jsx"), 600);
const ReadyGifts = lazyWithDelay(() => import("./pages/readyGifts/readyGifts.jsx"), 600);
const Registration = lazyWithDelay(() => import("./components/registration/registration.jsx"), 600);
const Login = lazyWithDelay(() => import("./components/login/login.jsx"), 600);
const Contacts = lazyWithDelay(() => import("./pages/contacts/contacts.jsx"), 600);
const AboutUs = lazyWithDelay(() => import("./pages/aboutUs/aboutUs.jsx"), 600);
const Liked = lazyWithDelay(() => import("./pages/liked/liked.jsx"), 600);
const Profile = lazyWithDelay(() => import("./pages/profile/profile.jsx"), 600);
const ProductPage = lazyWithDelay(() => import("./pages/productPage/productPage.jsx"), 600);
const Cart = lazyWithDelay(() => import("./pages/cart/cart.jsx"), 600);
const Forgot = lazyWithDelay(() => import("./components/forgot/forgot.jsx"), 600);
const Admin = lazyWithDelay(() => import("./pages/admin/admin.jsx"), 600);
const OrderPage = lazyWithDelay(() => import("./pages/orderPage/orderPage.jsx"), 600);
const ReviewPage = lazyWithDelay(() => import("./pages/reviewPage/reviewPage.jsx"), 600);
const ConstructorBox = lazyWithDelay(() => import("./pages/constructorBox/constructorBox.jsx"), 600);
const API_URL = "http://server.korobkabel.site"

function App() {
  const [reviewsList, setReviewsList] = useState([])
  const [pay, setPay] = useState([])
  const [categories,setCategories] = useState([]);
  const [newBoxList, setNewBoxList] = useState([]);
  const [modal, contextHolderEmail] = Modal.useModal();
  const [apis, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.cart)
  const order = useSelector(state => state.profile.order)
  const favoriteItem  = useSelector(state => state.liked.liked);
  const isAuth = useSelector(state => state.profile.isAuth)
  const userId = useSelector(state => state.profile.userId)
  const constructorArray = useSelector(state => state.profile.constructor)
  const role = useSelector(state => state.profile.role)

  const login = (id, role) => {
      dispatch(setIsAuth(true))
      dispatch(setUserId(id))
      dispatch(setRole(role))
      localStorage.setItem('user', JSON.stringify({ id: id, role: role }));
  }

  const logout = () => {
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; max-age=0; sameSite=None; secure";
      dispatch(setIsAuth(false))
      dispatch(setUserId(null))
      dispatch(setRole(null))
      localStorage.removeItem('user');
  }

  const checkAuth = async () => {
      if(localStorage.getItem('user')) {
          try {
              const response = await api.get(`${API_URL}/api/profile/token/refresh`, { withCredentials: true });
              if (response.status === 200) {
                  login(response.data.id, response.data.role)
              }
          } catch (error) {
              logout()
          }
      } else {
          logout()
      }
  }

  useEffect(() => {
      checkAuth()
  }, [login])

  useEffect(() => {
    getNewProduct()
    getBestReviews()
    getCategories()
    getWayPay()
  }, [])

  useEffect(() => {
    if(userId){
      getProfile()
    }
  }, [userId])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
  
    if (message) {
      navigate("/profile")
    }

  }, []);

  const calculatePrice = (cart) => {
    return cart.reduce((accumulator, product) => {
      const subtotal =  product.count * product.price;
      return accumulator + subtotal;
    }, 0);
  }

  const postLogin = async (values) => {
    await api.post("/api/auth/login", values)
               .then((res) => { 
                  login(res.data.id, res.data.role);
                  if (res.status === 200) {
                      navigate("/");
                  }
              })
              .catch((error) => {
                openNotificationError('bottomRight', error.response.data.message)
              })
}

  const postRegistration = async (values) => {
    try {
      const response = await api.post("/api/auth/registration", values);

      if (response.status === 200) {
          navigate("/api/auth/login");
      }
    } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.message) {
            openNotificationError('bottomRight', error.response.data.message);
        } else {
            console.error("Error occurred during registration:", error);
        }
    }
  }

  const getProfile = async () => {
    try {
      await api.get(`/api/profile/${userId}`)
        .then(response => {
          
          dispatch(addInfoProfile(response.data.user))

          if(response.data.cart && cart.length === 0) {
            const newCart = [...response.data.cart]
            const newCartItem = newCart.map(item => ({
              ...item.product,
              count: item.quantity,
            }));
            newCartItem.forEach(element => {
              dispatch(addProductCart(element))
            });
          }

          if(response.data.favorite && favoriteItem.length === 0) {
            const newFavorite = [...response.data.favorite]
            newFavorite.forEach(element => {
              dispatch(addProductFavorite(element))
            });
          }

          if(response.data.order.length !== 0 && order.length === 0) {
            response.data.order.forEach(element => {
              dispatch(addProductProfile(element))
            })
          }

          if(response.data.orderConstructor.length !== 0 && constructorArray.length === 0) {
            response.data.orderConstructor.forEach(element => {
              dispatch(addConstructorProfile(element))
            })
          }

        })
        .catch(response => {
          console.log(response.message);
        })
        
    } catch (error) {
      console.log("Ошибка", error);
    }
  }

  const getCategories = async () => {
    try {
      await api.get('/api/category/all')
        .then(response => {
          setCategories([...response.data.categories]);
        })
        
    } catch (error) {
      console.log("Ошибка", error);
    }
  }

  const getTypesBox = async () => {
    let typesBox
    try {
      await api.get('/api/constructor/box/types')
        .then(response => {
          typesBox = response.data
        })
        .catch(response => {
          if(response.response.status == 401) {
            console.log(response.response);
          }
        })
        return typesBox
    } catch (error) {
      console.log("Ошибка", error);
    }
  }

  const getProduct = async () => {
    let productBox
    try {
      await api.get('/api/constructor/product')
        .then(response => {
          productBox = response.data
        })
        .catch(response => {
          if(response.response.status == 401) {
            console.log(response.response);
          }
        })
        return productBox
    } catch (error) {
      console.log("Ошибка", error);
    }
  }

  const getPostCard = async () => {
    let postCard
    try {
      await api.get('/api/constructor/post-card')
        .then(response => {
          postCard = response.data
        })
        .catch(response => {
          if(response.response.status == 401) {
            console.log(response.response);
          }
        })
        return postCard
    } catch (error) {
      console.log("Ошибка", error);
    }
  }

  const countDown = (type, message) => {
    const modalConfig = {
      title: 'Подписка на новости Korobka',
      content: message,
      okText: 'Хорошо'
    };

    if (type === 'success') {
        modalConfig.class = 'custom-modal'; // Добавляем класс для успешного сообщения
        modal.success(modalConfig);
    } 
    else if (type === 'error') {
        modalConfig.class = 'custom-modal'; // Добавляем класс для сообщения об ошибке
        modal.error(modalConfig);
    }
  };

  const getNewProduct = async () => {
    try {
      await api.get('/api/products/new')
                 .then(response => {
                  setNewBoxList(response.data)
                 })
                 .catch(error => alert(error.message))
    } catch (error) {
      console.log("Ошибка", error);
    }
  }

  const openNotification = (placement, text) => {
    apis.success({
      message: <p>{text}</p>,
      placement,
      closeIcon: false,
      duration: 1.5,
    });
  };

  const openNotificationError = (placement, text) => {
    apis.error({
      message: <p>{text}</p>,
      placement,
      closeIcon: false,
      duration: 1.5,
    });
  };

  const postResetPassword = async (values) => {
    try {
      await api.post('/api/auth/reset-password-request', {email: values.email})
        .then(response => {
          if(response.status == 201) {
            openNotification('bottomRight', response.data.message);
            setTimeout(() => {
              navigate("/api/auth/login")
            }, 1000)
          } 
        })
        .catch(response => {
          if(response.response.status == 400) {
            openNotificationError('bottomRight', response.response.data.message);
          }
      });
    } catch (error) {
      console.log(error.message)
    }
  }

  const postTwoPassword = async (values, token) => {
    console.log(values, token);
    try {
      await api.post(`/api/auth/reset-password/${token}`, {password: values.password})
        .then(response => {
          if(response.status == 201) {
            openNotification('bottomRight', response.data.message);
            setTimeout(() => {
              navigate("/api/auth/login")
            }, 1000)
          } 
        })
        .catch(response => {
          if(response.response.status == 400) {
            openNotificationError('bottomRight', response.response.data.message);
          }
      });
    } catch (error) {
      console.log(error.message)
    }
  }

  const sendEmailData = async (email) => {
    console.log(email)
    try {
      await api.post('/api/email/send', {email: email})
        .then(response => {
          if(response.status == 202) {
            countDown('success', response.data.message)
          } 
        })
        .catch(response => {
          if(response.response.status == 400) {
            countDown('error', response.response.data.message) 
          }
          if(response.response.status == 401) {
            logout()
            navigate("/api/auth/login");
          }
      });
    } catch (error) {
      console.log(error.message)
    }
  }

  const uploadAvatar = async (formData) => {
    console.log(formData);
    const data = JSON.parse(localStorage.getItem('userData')) || '';
    let url;
    try {
      await api.patch("/api/profile/upload-image", formData, {
        headers: {
            'Authorization': `${data.token}`,
            'Content-Type': 'multipart/form-data',
        }})
        .then(response => {
          openNotification('bottomRight', response.data.message)
          url = response.data.url
        })
        .catch(response => {
          console.log(response)
          if(response.status == 401) {
            logout()
            navigate("/api/auth/login");
          }
        })
        
    } catch (error) {
      console.log("Ошибка", error);
    }
    return url
  }

  const updatePassUser = async (passData) => {
    let resultPass;
    try {
      await api.patch(`/api/profile/${userId}/password`, passData)
        .then(response => {
          if(response.status == 201){ 
            openNotification('bottomRight', response.data.message)
            resultPass = response.data.resultPass
          }
        })
        .catch(response => {
          if(response.response.status == 400) {
            resultPass = response.response.data.resultPass
          }
          if(response.response.status == 500) {
            openNotificationError('bottomRight', response.response.data.message)
          }
          if(response.response.status == 401) {
            logout()
            navigate("/api/auth/login");
          }
        })
        
    } catch (error) {
      console.log("Ошибка", error);
    }
    return resultPass
  }

  const getBestReviews = async () => {
    try {
      await api.get('/api/reviews/best')
                .then(response => {
                  setReviewsList(response.data)
                })
                .catch(error => alert(error.message))
    } catch (error) {
      console.log("Ошибка", error);
    }
  }

  const getWayPay = async () => {
    try {
      await api.get('/api/way-pay/all')
                .then(response => {
                  setPay(response.data)
                })
                .catch(error => alert(error.message))
    } catch (error) {
      console.log("Ошибка", error);
    }
  }
  
  const orderCheckout = async (order, values, promo, totalPrice, constructor = false) => {
    let originalFormat = parseFloat(totalPrice.replace(/\s/g, '').replace(',', '.'));
    const items = order.map(item => ({
      id: item._id, 
      count: item.count || 1,
      price: parseFloat(item.price.replace(/\s/g, '').replace(',', '.')),
      name: item.title
    }));

    try {
      await api.post('/api/profile/pay/checkout', {
        items: items, promo: promo && promo.percentage ? promo.percentage : null, totalAmount: originalFormat})
                .then(response => {
                  originalFormat = null
                  localStorage.setItem('initialValues', JSON.stringify(values))
                  localStorage.setItem('order', JSON.stringify(order))
                  localStorage.setItem('promo', JSON.stringify(promo))
                  localStorage.setItem('totalAmount', JSON.stringify(originalFormat))

                  if(constructor) {
                    localStorage.setItem('constructor', JSON.stringify(true))
                  }
                  
                  window.location = response.data.url
                })
                .catch(error => alert(error.message))
    } catch (error) {
      console.log("Ошибка", error);
    }
  }

  const adminFetch = async () => {
    let message;
    try {
      await api.get(`/api/auth/admin/${userId}`)
        .then(response => {
          message = response.data.message;    
        })
        .catch(response => {
          if(response.response.status == 401) {
            logout()
            navigate("/api/auth/login");
          }
      });
    } catch (error) {
      console.log(error.message)
    }
    return message
  }

  const postCheckOrder = async (orderId) => {
    let url;
    try {
      await api.get(`/api/profile/order/${orderId}/check`)
        .then(response => {
          if(response.status == 200) {
            url = response.data.url
          }    
        })
    } catch (error) {
      console.log(error.message);
    }
    return url
  }
  
  const postCheckOrderConstructor = async (orderId) => {
    let url;
    try {
      await api.get(`/api/profile/order/constructor/${orderId}/check`)
        .then(response => {
          if(response.status == 200) {
            url = response.data.url
          }    
        })
    } catch (error) {
      console.log(error.message);
    }
    return url
  }

  const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 20);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        userId,
        role,
        contextHolder,
        contextHolderEmail,
        newBoxList,
        orderCheckout,
        favoriteItem,
        getProduct,
        sendEmailData,
        postResetPassword,
        uploadAvatar,
        getProfile,
        openNotification,
        openNotificationError,
        isAuth,
        getPostCard,
        updatePassUser,
        reviewsList,
        getBestReviews,
        pay,
        postTwoPassword,
        adminFetch,
        categories,
        scrollToTop,
        getCategories,
        getWayPay,
        getTypesBox,
        postRegistration,
        calculatePrice,
        postLogin,
        postCheckOrder,
        postCheckOrderConstructor
      }}
    >
        <Routes>
          <Route
              path="/*"
              element={
                  <HomePage/>
              }
            >
              <Route index element={<Main />} />
              <Route path="constructor" element={<ConstructorBox />} />
              <Route path="ready-gifts/:category" element={<ReadyGifts />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="about-us" element={<AboutUs />} />
                
              <Route path="cart" element={<Cart/>}/>
              <Route path="liked" element={<Liked favoriteItem={favoriteItem}/>} />
              <Route path="profile" element={<Profile />} />
              <Route path="product/:id/review" element={<ReviewPage/>}/>
              <Route path="cart/order" element={<OrderPage/>}/>

              <Route path="product/:id" element={<ProductPage/>}/>
          </Route>
          <Route path="/api/auth/*" element={
              <Suspense fallback={<Loading />}>
                <Auth />
              </Suspense>
            }>
            <Route path="registration" element={<Registration />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot" element={<Forgot />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="admin/:userId/*" element={<Admin />} />
          </Route>
        </Routes>
    </AuthContext.Provider>
  );
}

export default App;
