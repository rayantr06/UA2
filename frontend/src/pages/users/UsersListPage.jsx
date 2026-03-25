import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Edit2, Eye, Plus, Search, Trash2, UserCircle2 } from 'lucide-react';
import { deleteUser, fetchUsers } from '../../features/users/usersSlice';

const UsersListPage = () => {
  const dispatch = useDispatch();
  const { items, loading, currentPage, totalPages } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers({ page, search: searchTerm }));
  }, [dispatch, page, searchTerm]);

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      dispatch(deleteUser(id));
    }
  };

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

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

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 hidden md:table-cell">DepartmentId</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                    Chargement...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                    Aucun utilisateur trouve.
                  </td>
                </tr>
              ) : (
                items.map((user) => (
                  <tr key={user.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                      {user.DepartmentId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/users/edit/${user.id}`}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-40"
              onClick={() => setPage((value) => value - 1)}
              disabled={!canGoPrev}
            >
              Precedent
            </button>
            <button
              type="button"
              className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-40"
              onClick={() => setPage((value) => value + 1)}
              disabled={!canGoNext}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersListPage;
