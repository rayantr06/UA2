import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEquipments, deleteEquipment } from '../../features/equipment/equipmentSlice';
import { Plus, Edit2, Trash2, Eye, Search, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const EquipmentList = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.equipment);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchEquipments({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet équipement ?')) {
      dispatch(deleteEquipment(id));
    }
  };

  const getModeleBadge = (modele) => {
    const styles = {
      nouveau: 'bg-green-100 text-green-700',
      ancien: 'bg-amber-100 text-amber-700',
      refait: 'bg-blue-100 text-blue-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[modele] || 'bg-gray-100 text-gray-600'}`}>
        {modele.charAt(0).toUpperCase() + modele.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Équipements</h1>
          <p className="text-gray-500 text-sm">Gérez l'inventaire des équipements</p>
        </div>
        <Link to="/equipment/new" className="btn-primary flex items-center justify-center gap-2">
          <Plus size={18} />
          Nouvel Équipement
        </Link>
      </div>

      <div className="card p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un équipement..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-gray-400">Chargement...</div>
          ) : items.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-400">Aucun équipement trouvé.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="group card hover:-translate-y-1 transition-all duration-300">
                <div className="h-48 bg-gray-50 relative overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.nom} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <Smartphone size={48} />
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
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-white/90 backdrop-blur rounded-lg text-red-600 shadow-sm hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {item.nom}
                    </h3>
                    {getModeleBadge(item.modele)}
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                    {item.description || 'Pas de description'}
                  </p>
                  <Link
                    to={`/equipment/${item.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Eye size={16} />
                    Voir détails
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentList;
