import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, UserCircle2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import { deleteUser, fetchUsers } from '../../features/users/usersSlice';

const UsersListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, currentPage, totalPages } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers({ page, search: searchTerm }));
  }, [dispatch, page, searchTerm]);

  const handleDelete = (user) => {
    if (window.confirm(`Supprimer l'utilisateur ${user.nom} ${user.prenom} ?`)) {
      dispatch(deleteUser(user.id));
    }
  };

  const columns = [
    {
      label: 'Utilisateur',
      key: 'nom',
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center overflow-hidden">
            {user.photo ? (
              <img src={user.photo} alt={user.nom} className="w-full h-full object-cover" />
            ) : (
              <UserCircle2 size={26} />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {user.nom} {user.prenom}
            </p>
            <p className="text-xs text-gray-500">ID #{user.id}</p>
          </div>
        </div>
      ),
    },
    { label: 'Email', key: 'email' },
    {
      label: 'Departement',
      key: 'DepartmentId',
      render: (value, user) => user.Department?.nom || value || 'N/A',
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-500 text-sm">Gestion simple des comptes utilisateurs</p>
        </div>
        <Link to="/users/new" className="btn-primary flex items-center justify-center gap-2">
          <Plus size={18} />
          Nouvel utilisateur
        </Link>
      </div>

      <div className="card p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          emptyMessage="Aucun utilisateur trouve."
          onView={(user) => navigate(`/users/${user.id}`)}
          onEdit={(user) => navigate(`/users/edit/${user.id}`)}
          onDelete={handleDelete}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default UsersListPage;
