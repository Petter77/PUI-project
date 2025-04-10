import './App.scss'
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MyRecipes from './pages/MyRecipes';
import MyMealPlans from './pages/MyMealPlans';
import { useEffect, useState } from 'react';
import TopBar from './layout/TopBar/TopBar';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  return (
    <div className="app">
      <TopBar user={user} setUser={setUser}/>

      <div className="main-content">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={!user ? <Login setUser={setUser}/> : <Navigate to="/" />} />
          <Route path='/register' element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/myRecipes" element={user ? <MyRecipes /> : <Navigate to="/login" />} />
          <Route path='/myMealPlans' element={user ? <MyMealPlans /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}



export default App
