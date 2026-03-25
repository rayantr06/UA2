import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, ShieldCheck } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { deleteRole, fetchRoles } from '../../features/roles/rolesSlice';

const RolesListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.roles);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const filteredRoles = items.filter((role) =>
    `${role.titre || ''} ${role.description || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (role) => {
    if (window.confirm(`Supprimer le role ${role.titre} ?`)) {
      dispatch(deleteRole(role.id));
    }
  };

  const columns = [
    {
      label: 'Titre',
      key: 'titre',
      render: (value, role) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 md:hidden line-clamp-1">
              {role.description || 'Aucune description'}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: 'Description',
      key: 'description',
      render: (value) => <span className="line-clamp-1">{value || 'Aucune description'}</span>,
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
          <p className="text-gray-500 text-sm">Gerer les roles disponibles dans l'application</p>
        </div>
        <Link to="/roles/new" className="btn-primary flex items-center justify-center gap-2">
          <Plus size={18} />
          Nouveau role
        </Link>
      </div>

      <div className="card p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un role..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredRoles}
          loading={loading}
          emptyMessage="Aucun role trouve."
          onView={(role) => navigate(`/roles/${role.id}`)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default RolesListPage;
