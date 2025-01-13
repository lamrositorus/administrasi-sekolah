import React, { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ value, onChange, isDarkMode, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center border border-gray-300 rounded-md bg-transparent" >
      <FaLock className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} ml-2`} />
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required
        className={` block w-full p-2  focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-transparent text-white' : 'bg-transparent'}`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="ml-2"
      >
        {showPassword ? (
          <FaEyeSlash className="w-5 h-5 text-gray-400" />
        ) : (
          <FaEye className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;