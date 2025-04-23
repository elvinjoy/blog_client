import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ForgotPassword from "./Pages/ForgotPassword";
import Posts from "./Pages/myPosts";
import AddPost from "./Pages/addPosts";
import EditBlogs from './Pages/editBlogs';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Dashboard Route */}
        <Route path="/" element={<Dashboard />} />

        {/* Posts Routes */}
        <Route path="/posts" element={<Posts />} />         {/* <-- Posts page */}
        <Route path="/add-post" element={<AddPost />} />    {/* <-- AddPost page */}

        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Edit Blog Route */}
        <Route path="/edit-blog/:id" element={<EditBlogs />} /> {/* <-- EditBlogs page */}

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
