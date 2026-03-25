import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLaboratories, deleteLaboratory } from '../../features/laboratories/laboratoriesSlice';
import { Plus, Edit2, Trash2, Eye, Search, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const LaboratoryList = () => {
  const dispatch = useDispatch();
  const { items, total, currentPage, totalPages, loading } = useSelector((state) => state.laboratories);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchLaboratories({ page: 1, search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce laboratoire ?')) {
      dispatch(deleteLaboratory(id));
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laboratoires</h1>
          <p className="text-gray-500 text-sm">Gérez les laboratoires de l'établissement</p>
        </div>
        <Link to="/laboratories/new" className="btn-primary flex items-center justify-center gap-2">
          <Plus size={18} />
          Nouveau Laboratoire
        </Link>
      </div>

      <div className="card p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un laboratoire..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Salle</th>
                <th className="px-6 py-4 hidden md:table-cell">Information</th>
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
                    Aucun laboratoire trouvé.
                  </td>
                </tr>
              ) : (
                items.map((lab) => (
                  <tr key={lab.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold overflow-hidden">
                          {lab.image ? (
                            <img src={lab.image} alt={lab.nom} className="w-full h-full object-cover" />
                          ) : (
                            lab.nom[0]
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{lab.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{lab.salle || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                      <span className="line-clamp-1">{lab.information || 'Aucune info'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/laboratories/${lab.id}`}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/laboratories/edit/${lab.id}`}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(lab.id)}
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

export default LaboratoryList;
