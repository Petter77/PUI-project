import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = ({ setUserToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username || !password) {
      return setErrorMessage('Wypełnij wszystkie pola!');
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        UserName: username,
        password: password,
      });

      sessionStorage.setItem("user", JSON.stringify(response.data));
      setUserToken(response.data);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.response?.data || 'Błąd logowania');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121216] text-white">
      <div className="bg-[#1f1f23] p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Logowanie</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-semibold">Nazwa użytkownika</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2c2c32] text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-semibold">Hasło</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2c2c32] text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          {errorMessage && (
            <div className="bg-red-500 text-white text-sm p-3 rounded-lg">
              {errorMessage}
            </div>
          )}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 py-3 rounded-lg font-semibold"
            >
              Zaloguj się
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
