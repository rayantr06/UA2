import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Eye, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { deleteRole, fetchRoles } from '../../features/roles/rolesSlice';

const RolesListPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.roles);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const filteredRoles = items.filter((role) =>
    `${role.titre || ''} ${role.description || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce role ?')) {
      dispatch(deleteRole(id));
    }
  };

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

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Titre</th>
                <th className="px-6 py-4 hidden md:table-cell">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-gray-400">
                    Chargement...
                  </td>
                </tr>
              ) : filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-gray-400">
                    Aucun role trouve.
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <tr key={role.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{role.titre}</p>
                          <p className="text-xs text-gray-400 md:hidden line-clamp-1">{role.description || 'Aucune description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                      <span className="line-clamp-1">{role.description || 'Aucune description'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/roles/${role.id}`}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(role.id)}
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
      </div>
    </div>
  );
};

export default RolesListPage;
