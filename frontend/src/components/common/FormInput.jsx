import React from 'react';

const FormInput = ({ label, name, register, errors, type = 'text', placeholder, ...rest }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
          errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-primary-500'
        }`}
        {...rest}
      />
      {errors[name] && (
        <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>
      )}
    </div>
  );
};

export default FormInput;
