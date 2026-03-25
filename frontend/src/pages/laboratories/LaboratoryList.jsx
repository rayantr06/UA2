import React, { useDeferredValue, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearError,
  deleteLaboratory,
  fetchLaboratories,
} from '../../features/laboratories/laboratoriesSlice';
import { ChevronLeft, ChevronRight, Edit2, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 10;

const LaboratoryList = () => {
  const dispatch = useDispatch();
  const { items, total, currentPage, totalPages, loading, error } = useSelector(
    (state) => state.laboratories
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const deferredSearchTerm = useDeferredValue(searchTerm.trim());

  useEffect(() => {
    dispatch(fetchLaboratories({ page, size: PAGE_SIZE, search: deferredSearchTerm }));
  }, [deferredSearchTerm, dispatch, page]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce laboratoire ?')) {
      return;
    }

    try {
      await dispatch(deleteLaboratory(id)).unwrap();
      const nextPage = items.length === 1 && page > 1 ? page - 1 : page;

      if (nextPage !== page) {
        setPage(nextPage);
        return;
      }

      dispatch(fetchLaboratories({ page: nextPage, size: PAGE_SIZE, search: deferredSearchTerm }));
    } catch {
      // The slice stores the API error for inline display.
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laboratoires</h1>
          <p className="text-gray-500 text-sm">Gerez les laboratoires de l'etablissement</p>
        </div>
        <Link to="/laboratories/new" className="btn-primary flex items-center justify-center gap-2">
          <Plus size={18} />
          Nouveau laboratoire
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Page</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {currentPage} / {totalPages}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Recherche</p>
          <p className="text-sm font-semibold text-gray-900 mt-3">
            {deferredSearchTerm || 'Toutes les donnees'}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-4">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => dispatch(clearError())}
            className="font-semibold text-red-700 hover:text-red-800"
          >
            Fermer
          </button>
        </div>
      )}

      <div className="card p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un laboratoire..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
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
                    Aucun laboratoire trouve.
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
                            lab.nom?.charAt(0)?.toUpperCase() || 'L'
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
                          type="button"
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

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">
            {items.length} resultat(s) affiches sur {total}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page <= 1 || loading}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Precedent
            </button>
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={page >= totalPages || loading}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryList;
