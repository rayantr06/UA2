import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FlaskConical, Laptop, ShieldCheck, Users } from 'lucide-react';

const modules = [
  {
    title: 'Laboratories',
    description: 'Consulter et gerer les laboratoires.',
    icon: FlaskConical,
    path: '/laboratories',
  },
  {
    title: 'Equipment',
    description: 'Suivre les equipements du campus.',
    icon: Laptop,
    path: '/equipment',
  },
  {
    title: 'Users',
    description: 'La gestion des utilisateurs arrive ici.',
    icon: Users,
    path: '/users',
  },
  {
    title: 'Roles',
    description: 'La gestion des roles arrive ici.',
    icon: ShieldCheck,
    path: '/roles',
  },
];

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="p-6 space-y-6">
      <section className="card p-6">
        <p className="text-sm text-gray-500 mb-2">Dashboard</p>
        <h1 className="text-3xl font-bold text-gray-900">Bienvenue sur EduManager</h1>
        <p className="text-gray-600 mt-3">
          {user?.prenom || user?.nom
            ? `Session ouverte pour ${user.prenom || ''} ${user.nom || ''}`.trim()
            : 'Session ouverte'}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {modules.map((module) => {
          const IconComponent = module.icon;

          return (
            <Link key={module.path} to={module.path} className="card p-6 hover:-translate-y-1 transition-transform duration-200">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                <IconComponent size={24} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{module.title}</h2>
              <p className="text-sm text-gray-500 mt-2">{module.description}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
};

export default DashboardPage;
