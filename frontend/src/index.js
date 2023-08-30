import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter,createRoutesFromElements,Route,RouterProvider } from 'react-router-dom';
import Contact from './pages/Contact';
import About from './pages/About';
import Menu from './pages/Menu';
import Home from './pages/Home';
import Login from './pages/Login';
import Newproducts from './pages/Newproducts';
import Signup from './pages/Signup';
import { store } from './redux/index'
import { Provider } from 'react-redux';
import AdminRoute from './AdminRoute';
import Cart from './pages/Cart';
import EditProduct from './pages/Editproduct';
import UserSetting from './pages/UserSetting';
import Order from './pages/Order';
import AdminOrder from './pages/AdminOrder';
import Error from './pages/Error';
 
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home/>}/>
      <Route path="menu" element={<Menu/>}/>
      <Route path="menu/:filterBy" element={<Menu/>}/>
      <Route path="about" element={<About/>}/>
      <Route path="contact" element={<Contact/>}/>
      <Route path="login" element={<Login/>}/>
      <Route
        path="addproduct"
        element={<AdminRoute element={<Newproducts />} />}
      />
      <Route
        path="editproduct/:id"
        element={<AdminRoute element={<EditProduct />} />}
      />
     <Route
        path="adminorder"
        element={<AdminRoute element={<AdminOrder />} />}
      />
      <Route path="signup" element={<Signup/>}/>
      <Route path="cart" element={<Cart/>}/>
      <Route path="setting" element={<UserSetting/>}/>
      <Route path="order" element={<Order/>}/>
      <Route path="*" element={<Error />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <RouterProvider router={router}/>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
