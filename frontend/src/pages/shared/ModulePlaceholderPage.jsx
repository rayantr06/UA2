import React from 'react';
import { Link } from 'react-router-dom';

const ModulePlaceholderPage = ({ title, description }) => {
  return (
    <div className="p-6">
      <div className="card p-8 max-w-3xl">
        <p className="text-sm text-gray-500 mb-2">Module en preparation</p>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-3">{description}</p>
        <p className="text-sm text-gray-500 mt-4">
          Cette page est deja branchee dans les routes pour que le travail d'equipe puisse avancer sans bloquer
          l'integration.
        </p>
        <Link to="/" className="inline-flex items-center mt-6 text-primary-600 font-medium hover:text-primary-700">
          Retour au dashboard
        </Link>
      </div>
    </div>
  );
};

export default ModulePlaceholderPage;
