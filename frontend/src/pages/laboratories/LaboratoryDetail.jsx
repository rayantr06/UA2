import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchLaboratoryById, deleteLaboratory } from '../../features/laboratories/laboratoriesSlice';
import { ArrowLeft, Edit2, Trash2, MapPin, Info, Settings } from 'lucide-react';

const LaboratoryDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentLaboratory, loading } = useSelector((state) => state.laboratories);

  useEffect(() => {
    dispatch(fetchLaboratoryById(id));
  }, [id, dispatch]);

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce laboratoire ?')) {
      dispatch(deleteLaboratory(id));
      navigate('/laboratories');
    }
  };

  if (loading || !currentLaboratory) {
    return <div className="p-10 text-center text-gray-400">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/laboratories')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft size={20} />
          Retour
        </button>
        <div className="flex gap-2">
          <Link
            to={`/laboratories/edit/${id}`}
            className="px-4 py-2 border border-gray-200 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-2"
          >
            <Edit2 size={18} />
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <Trash2 size={18} />
            Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="h-64 sm:h-80 bg-gray-100 relative">
              {currentLaboratory.image ? (
                <img
                  src={currentLaboratory.image}
                  alt={currentLaboratory.nom}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Settings size={64} />
                </div>
              )}
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentLaboratory.nom}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin size={20} className="text-primary-500" />
                <span className="text-lg">Salle: {currentLaboratory.salle}</span>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Info size={16} />
                  Informations complémentaires
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {currentLaboratory.information || "Aucune information supplémentaire disponible pour ce laboratoire."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Stats */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Département</h3>
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
              <p className="text-primary-900 font-medium">
                {currentLaboratory.Department?.nom || "Département non assigné"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryDetail;
