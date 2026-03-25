import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchEquipmentById, deleteEquipment } from '../../features/equipment/equipmentSlice';
import { ArrowLeft, Edit2, Trash2, Smartphone, Info, Box } from 'lucide-react';

const EquipmentDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEquipment, loading } = useSelector((state) => state.equipment);

  useEffect(() => {
    dispatch(fetchEquipmentById(id));
  }, [id, dispatch]);

  const handleDelete = () => {
    if (window.confirm('Supprimer cet équipement ?')) {
      dispatch(deleteEquipment(id));
      navigate('/equipment');
    }
  };

  if (loading || !currentEquipment) return <div className="p-10 text-center text-gray-400">Chargement...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={() => navigate('/equipment')} className="p-2 hover:bg-gray-100 rounded-full flex items-center gap-2 text-gray-600">
          <ArrowLeft size={20} /> Retour
        </button>
        <div className="flex gap-2">
          <Link to={`/equipment/edit/${id}`} className="px-4 py-2 border border-gray-200 rounded-lg text-amber-600 hover:bg-amber-50 flex items-center gap-2">
            <Edit2 size={18} /> Modifier
          </Link>
          <button onClick={handleDelete} className="px-4 py-2 border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2">
            <Trash2 size={18} /> Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card h-96 overflow-hidden">
          {currentEquipment.image ? (
            <img src={currentEquipment.image} alt={currentEquipment.nom} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200">
              <Smartphone size={96} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-8">
            <div className="flex items-center gap-2 mb-2">
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                 currentEquipment.modele === 'nouveau' ? 'bg-green-100 text-green-700' : 
                 currentEquipment.modele === 'ancien' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
               }`}>
                 Modèle {currentEquipment.modele}
               </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{currentEquipment.nom}</h1>
            
            <div className="space-y-6">
               <div className="flex items-start gap-3">
                 <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><Box size={20} /></div>
                 <div>
                   <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Laboratoire</p>
                   <p className="text-lg text-gray-900 font-medium">{currentEquipment.Laboratory?.nom || 'Non spécifié'}</p>
                 </div>
               </div>

               <div className="flex items-start gap-3">
                 <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><Info size={20} /></div>
                 <div>
                   <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Description</p>
                   <p className="text-gray-700 leading-relaxed">{currentEquipment.description || 'Acune description pour cet équipement.'}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
