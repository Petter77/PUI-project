import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    UserName: '',
    UserEmail: '',
    UserPassword: '',
    UserTelephone: '',
    UserWeight: '',
    UserHeight: '',
    UserBirthDate: '',
    UserSex: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await axios.post('http://localhost:3000/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Błąd rejestracji.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Rejestracja</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="UserName"
            placeholder="Nazwa użytkownika"
            value={formData.UserName}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input 
            type="email" 
            name="UserEmail"
            placeholder="Email"
            value={formData.UserEmail}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input 
            type="password" 
            name="UserPassword"
            placeholder="Hasło"
            value={formData.UserPassword}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input 
            type="tel" 
            name="UserTelephone"
            placeholder="Telefon"
            value={formData.UserTelephone}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="number" 
            name="UserWeight"
            placeholder="Waga (kg)"
            value={formData.UserWeight}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="number" 
            name="UserHeight"
            placeholder="Wzrost (cm)"
            value={formData.UserHeight}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="date" 
            name="UserBirthDate"
            value={formData.UserBirthDate}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select 
            name="UserSex"
            value={formData.UserSex}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Wybierz płeć</option>
            <option value="Male">Mężczyzna</option>
            <option value="Female">Kobieta</option>
          </select>

          {errorMessage && (
            <div className="text-red-600 text-sm bg-red-100 p-3 rounded">
              {errorMessage}
            </div>
          )}
          
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 p-3 rounded-lg font-semibold text-white"
          >
            Zarejestruj się
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
