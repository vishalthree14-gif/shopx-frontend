import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './auth/Login';
import Signup from './auth/SignUp';
import Home from './pages/Home';
import Profile from './profile/ProfilePage';
import EditProfilePage from './profile/EditProfilePage';
import UpdatePassword from './profile/UpdatePassword';
import ProductDetails from './products/ProductDetails';
import CartPage from './cart/CartPage';
import OrdersPage from "./orders/OrdersPage";


function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>

            <Route path='/' element={ <Login/> } />
            <Route path='/signup' element = { <Signup /> } />

            // profile api's

            <Route path='/profile' element = {<Profile />} />
            <Route path='/editProfile' element = {<EditProfilePage />} />
            <Route path='/updatePass' element = {<UpdatePassword />} />

            //products api 
            <Route path='/home' element = { <Home/> } />
            <Route path="/product/:productId" element={<ProductDetails />} />

            // cart api
            <Route path='/cart' element={<CartPage />} />

            // order api
            <Route path="/orders" element={<OrdersPage />} />


          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
