import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// User Pages
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ForgotPassword from "./Pages/ForgotPassword";
import Posts from "./Pages/myPosts";
import AddPost from "./Pages/addPosts";
import EditBlogs from './Pages/editBlogs';

// Admin Pages
import AdminLogin from "./Pages/adminLogin";
import AdminDashboard from "./Pages/adminDashboard";
import ManageUsers from "./Pages/manageUsers";
import AllBlogsAdmin from "./Pages/allBlogsAdmin";
import EditBlogsByAdmin from './Pages/editBlogsByAdmin';
import SpecificPost from './Pages/specificPost';
import ManageCategories from './Pages/manageCategories';
import Comments from './Pages/comments';
import AddCategories from './Pages/addCategories';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={4000} />
      <Routes>
        {/* User Dashboard Route */}
        <Route path="/" element={<Dashboard />} />

        {/* Posts Routes */}
        <Route path="/posts" element={<Posts />} />
        <Route path="/add-post" element={<AddPost />} />

        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Blog Editing Route */}
        <Route path="/edit-blog/:id" element={<EditBlogs />} />

        {/* Admin Routes */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />

        <Route path="/manageusers" element={<ManageUsers />} />
        <Route path="/allblogsadmin" element={<AllBlogsAdmin />} />
        <Route path="/editblogsbyadmin/:id" element={<EditBlogsByAdmin />} />
        <Route path="/specificpost/:id" element={<SpecificPost />} />
        <Route path="/allcategories" element={<ManageCategories />} />

        {/* Comments Route */}  
        <Route path="/comments/:blogid" element={<Comments />} />
        <Route path="/add-categories" element={<AddCategories />} />

        {/* Redirect to Dashboard for unknown routes */}
        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
