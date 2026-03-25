import React from 'react';

const SelectInput = ({ label, name, options, register, errors, placeholder, ...rest }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={name}
        {...register(name)}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer ${
          errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-primary-500'
        }`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.nom || option.libelle || option.name}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>
      )}
    </div>
  );
};

export default SelectInput;
