import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header/Header";
// import Footer from "./components/Footer/Footer";
import Homes from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import PrivateRoute from './components/Dashboard/PrivateRoute';
import Dashboard from './pages/Admin/Dashboard'; 
import Customer from './pages/Admin/Customer';
import Regis from './pages/Register/Register';
import Category from './pages/Admin/Category';
import Product from './pages/Admin/Product';
import Products from './pages/Home/Product';
import ProductDetail from './pages/Home/ProductDetail';
import Home from "./pages/User/Home";
import ProductUsers from './pages/User/Product';
import ProductDetailUsers from "./pages/User/ProductDetail";
import Checkout from "./pages/User/Checkout";
import Cart from "./pages/User/Cart";
import OrderConfirmation from "./pages/User/OrderCofirmation";
function App() {
  return (  
    <Router>
      <Routes>
        <Route path='/' element={<Homes/>}/>  
        <Route path='/products'element={<Products/>}/> 
        <Route path='/product-details' element={<ProductDetail/>}/>        
        <Route path='/login' element={<Login/>} ></Route>
        <Route path='/register' element={<Regis/>} ></Route>
        <Route path='/dashboard'
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path='/customer'
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <Customer />
            </PrivateRoute>
          }
        />
        <Route
          path='/category'
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <Category />
            </PrivateRoute>
          }
        />
        <Route
          path='/product'
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <Product />
            </PrivateRoute>
          }
        />
        <Route
          path='/home_page'
          element={
            <PrivateRoute allowedRoles={['USER']}>
              <Home/>
            </PrivateRoute>
          }
        />
        <Route
          path='/products_user'
          element={
            <PrivateRoute allowedRoles={['USER']}>
              <ProductUsers/>
            </PrivateRoute>
          }
        />
        <Route
          path='/products-details_user'
          element={
            <PrivateRoute allowedRoles={['USER']}>
              <ProductDetailUsers/>
            </PrivateRoute>
          }
        />
        <Route path='/checkout' element={<PrivateRoute allowedRoles={['USER']}><Checkout /></PrivateRoute>} />
        <Route path='/cart' element={<PrivateRoute allowedRoles={['USER']}><Cart/></PrivateRoute>} />
        <Route path='/order-confirmation' element={<PrivateRoute allowedRoles={['USER']}><OrderConfirmation/></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
