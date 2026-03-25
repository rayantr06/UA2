import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  clearCurrentEquipment,
  deleteEquipment,
  fetchEquipmentById,
} from '../../features/equipment/equipmentSlice';
import { ArrowLeft, Box, Edit2, FlaskConical, Info, Laptop, Trash2 } from 'lucide-react';

const getModeleStyle = (modele) => {
  if (modele === 'nouveau') {
    return 'bg-green-100 text-green-700';
  }

  if (modele === 'ancien') {
    return 'bg-amber-100 text-amber-700';
  }

  if (modele === 'refait') {
    return 'bg-blue-100 text-blue-700';
  }

  return 'bg-gray-100 text-gray-600';
};

const getModeleLabel = (modele) => {
  if (!modele) {
    return 'Non defini';
  }

  return modele.charAt(0).toUpperCase() + modele.slice(1);
};

const EquipmentDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEquipment, loading, submitting, error } = useSelector((state) => state.equipment);

  useEffect(() => {
    dispatch(fetchEquipmentById(id));

    return () => {
      dispatch(clearCurrentEquipment());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cet equipement ?')) {
      return;
    }

    try {
      await dispatch(deleteEquipment(id)).unwrap();
      navigate('/equipment');
    } catch {
      // The slice stores the API error for inline display.
    }
  };

  if (loading && !currentEquipment) {
    return <div className="p-10 text-center text-gray-400">Chargement...</div>;
  }

  if (!currentEquipment) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="card p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Equipement introuvable</h1>
          <p className="text-gray-500">
            {error || "Impossible d'afficher les details de cet equipement."}
          </p>
          <div>
            <button type="button" onClick={() => navigate('/equipment')} className="btn-primary">
              Retour a la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/equipment')}
          className="p-2 hover:bg-gray-100 rounded-full flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft size={20} /> Retour
        </button>
        <div className="flex gap-2">
          <Link
            to={`/equipment/edit/${id}`}
            className="px-4 py-2 border border-gray-200 rounded-lg text-amber-600 hover:bg-amber-50 flex items-center gap-2"
          >
            <Edit2 size={18} /> Modifier
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="px-4 py-2 border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 size={18} /> {submitting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card h-96 overflow-hidden">
          {currentEquipment.image ? (
            <img src={currentEquipment.image} alt={currentEquipment.nom} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200">
              <Laptop size={96} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-8">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getModeleStyle(
                  currentEquipment.modele
                )}`}
              >
                Modele {getModeleLabel(currentEquipment.modele)}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{currentEquipment.nom}</h1>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                  <Box size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Laboratoire
                  </p>
                  <p className="text-lg text-gray-900 font-medium">
                    {currentEquipment.Laboratory?.nom || 'Non specifie'}
                  </p>
                  {currentEquipment.LaboratoryId ? (
                    <Link
                      to={`/laboratories/${currentEquipment.LaboratoryId}`}
                      className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-primary-700 hover:text-primary-800"
                    >
                      <FlaskConical size={16} />
                      Voir le laboratoire
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                  <Info size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Description
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {currentEquipment.description || 'Aucune description pour cet equipement.'}
                  </p>
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
