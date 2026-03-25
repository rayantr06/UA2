import React, { useDeferredValue, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearError,
  deleteEquipment,
  fetchEquipments,
} from '../../features/equipment/equipmentSlice';
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  Laptop,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 10;

const getModeleStyle = (modele) => {
  const styles = {
    nouveau: 'bg-green-100 text-green-700',
    ancien: 'bg-amber-100 text-amber-700',
    refait: 'bg-blue-100 text-blue-700',
  };

  return styles[modele] || 'bg-gray-100 text-gray-600';
};

const getModeleLabel = (modele) => {
  if (!modele) {
    return 'Non defini';
  }

  return modele.charAt(0).toUpperCase() + modele.slice(1);
};

const EquipmentList = () => {
  const dispatch = useDispatch();
  const { items, total, currentPage, totalPages, loading, error } = useSelector(
    (state) => state.equipment
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const deferredSearchTerm = useDeferredValue(searchTerm.trim());

  useEffect(() => {
    dispatch(fetchEquipments({ page, size: PAGE_SIZE, search: deferredSearchTerm }));
  }, [deferredSearchTerm, dispatch, page]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet equipement ?')) {
      return;
    }

    try {
      await dispatch(deleteEquipment(id)).unwrap();
      const nextPage = items.length === 1 && page > 1 ? page - 1 : page;

      if (nextPage !== page) {
        setPage(nextPage);
        return;
      }

      dispatch(fetchEquipments({ page: nextPage, size: PAGE_SIZE, search: deferredSearchTerm }));
    } catch {
      // The slice stores the API error for inline display.
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipements</h1>
          <p className="text-gray-500 text-sm">Gerez l'inventaire des equipements</p>
        </div>
        <Link to="/equipment/new" className="btn-primary flex items-center justify-center gap-2">
          <Plus size={18} />
          Nouvel equipement
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
            placeholder="Rechercher un equipement..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-gray-400">Chargement...</div>
          ) : items.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-400">Aucun equipement trouve.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="group card hover:-translate-y-1 transition-all duration-300">
                <div className="h-48 bg-gray-50 relative overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.nom} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <Laptop size={48} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/equipment/edit/${item.id}`}
                      className="p-2 bg-white/90 backdrop-blur rounded-lg text-amber-600 shadow-sm hover:bg-amber-50"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-white/90 backdrop-blur rounded-lg text-red-600 shadow-sm hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2 gap-3">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {item.nom}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getModeleStyle(
                        item.modele
                      )}`}
                    >
                      {getModeleLabel(item.modele)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                    {item.description || 'Pas de description'}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    {item.Laboratory?.nom || 'Laboratoire visible sur la fiche detail'}
                  </p>
                  <Link
                    to={`/equipment/${item.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Eye size={16} />
                    Voir details
                  </Link>
                </div>
              </div>
            ))
          )}
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

export default EquipmentList;
