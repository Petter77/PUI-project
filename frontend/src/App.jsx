import { useEffect, useState } from "react";
import axios from 'axios';
import './index.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from "./pages/Dashboard";
import { Routes, Route, Navigate } from "react-router";
import Layout from "./Layout";
import MyRecipes from "./pages/MyRecipes";
import MyMealPlans from "./pages/MyMealPlans";
import UserProfile from "./pages/UserProfile";

function App() {

  const [userToken, setUserToken] = useState(sessionStorage.getItem('user'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserLoggedIn = async () => {
      try {
        const res = await axios.get('http://localhost:3000/auth/logged', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
        setUser(null);
      }
    };

    if (userToken) {
      sessionStorage.setItem("user", userToken);
      getUserLoggedIn();
    } else {
      sessionStorage.removeItem("user");
      setUser(null);
    }
  }, [userToken]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          userToken ? <Navigate to="/dashboard" /> : <Login setUserToken={setUserToken} />
        }
      />
      <Route
        path="/register"
        element={
          userToken ? <Navigate to="/dashboard" /> : <Register setUserToken={setUserToken} />
        }
      />
      <Route element={<Layout userToken={userToken} setUserToken={setUserToken} user={user}/>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/my-recipes"
          element={userToken ? <MyRecipes /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/my-meal-plans"
          element={userToken ? <MyMealPlans /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/user-profile"
          element={userToken ? <UserProfile /> : <Navigate to="/dashboard" />}
        />
      </Route>
    </Routes>
  );
}

export default App;
