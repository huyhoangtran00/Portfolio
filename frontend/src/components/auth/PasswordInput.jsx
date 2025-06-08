// src/components/auth/PasswordInput.jsx
import React, { useState } from 'react';

function PasswordInput({ password, setPassword }) {
  const [showRequirements, setShowRequirements] = useState(false);

  const meetsLength = password.length >= 8;
  const meetsLowercase = /[a-z]/.test(password);
  const meetsUppercase = /[A-Z]/.test(password);
  const meetsNumber = /[0-9]/.test(password);
  const meetsSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return (
    <div>
      <input
        type="password"
        placeholder="Enter a password"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onFocus={() => setShowRequirements(true)}
        onBlur={() => setShowRequirements(false)}
        required
      />
      {showRequirements && (
        <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-1">
          <p className={meetsLowercase ? 'text-green-600' : 'text-gray-600'}>
            {meetsLowercase ? '✓' : '•'} one lower case character
          </p>
          <p className={meetsSpecial ? 'text-green-600' : 'text-gray-600'}>
            {meetsSpecial ? '✓' : '•'} one special character
          </p>
          <p className={meetsUppercase ? 'text-green-600' : 'text-gray-600'}>
            {meetsUppercase ? '✓' : '•'} one uppercase character
          </p>
          <p className={meetsLength ? 'text-green-600' : 'text-gray-600'}>
            {meetsLength ? '✓' : '•'} 8 character minimum
          </p>
          <p className={meetsNumber ? 'text-green-600' : 'text-gray-600'}>
            {meetsNumber ? '✓' : '•'} one number
          </p>
        </div>
      )}
    </div>
  );
}

export default PasswordInput;