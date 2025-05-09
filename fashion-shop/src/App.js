import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header/Header";
// import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
// import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login/Login";
import PrivateRoute from './components/Dashboard/PrivateRoute';
import Dashboard from './pages/Admin/Dashboard'; 
import Customer from './pages/Admin/Customer';
import Regis from './pages/Register/Register';
function App() {
  return (
  // <Router>
  //   <div className="App">
  //       <Header/>
  //       <main>
  //           <Routes>
  //            <Route path='/' element={<Home/>}/>
  //             {/* <Route path="/mens-fashion" element={<MensFashion />} />
  //             <Route path="/womens-fashion" element={<WomensFashion />} />
  //             <Route path="/baby-fashion" element={<BabyFashion />} /> */}
  //           </Routes>
  //       </main>
  //      <Footer/>
  //   </div>
  // </Router>
    
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>           
        <Route path='/login' element={<Login/>} ></Route>
        <Route path='/register' element={<Regis/>} ></Route>
        <Route
          path='/dashboard'
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
      </Routes>
    </Router>
  );
}

export default App;
