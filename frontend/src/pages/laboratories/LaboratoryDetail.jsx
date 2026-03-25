import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  clearCurrentLaboratory,
  deleteLaboratory,
  fetchLaboratoryById,
  fetchLaboratoryEquipments,
} from '../../features/laboratories/laboratoriesSlice';
import { ArrowLeft, Edit2, Info, Laptop, MapPin, Settings, Trash2 } from 'lucide-react';

const LaboratoryDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentLaboratory,
    relatedEquipment,
    loading,
    relatedEquipmentLoading,
    relatedEquipmentError,
    submitting,
    error,
  } = useSelector((state) => state.laboratories);

  useEffect(() => {
    dispatch(fetchLaboratoryById(id));
    dispatch(fetchLaboratoryEquipments(id));

    return () => {
      dispatch(clearCurrentLaboratory());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!window.confirm('Supprimer ce laboratoire ?')) {
      return;
    }

    try {
      await dispatch(deleteLaboratory(id)).unwrap();
      navigate('/laboratories');
    } catch {
      // The slice stores the API error for inline display.
    }
  };

  if (loading && !currentLaboratory) {
    return <div className="p-10 text-center text-gray-400">Chargement...</div>;
  }

  if (!currentLaboratory) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="card p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Laboratoire introuvable</h1>
          <p className="text-gray-500">
            {error || "Impossible d'afficher les details de ce laboratoire."}
          </p>
          <div>
            <button
              type="button"
              onClick={() => navigate('/laboratories')}
              className="btn-primary"
            >
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
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="px-4 py-2 border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <Trash2 size={18} />
            {submitting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <span className="text-lg">Salle: {currentLaboratory.salle || 'Non renseignee'}</span>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Info size={16} />
                  Informations complementaires
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {currentLaboratory.information ||
                    'Aucune information supplementaire disponible pour ce laboratoire.'}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Equipements lies</h2>
                <p className="text-sm text-gray-500">Materiel rattache a ce laboratoire</p>
              </div>
              <Link
                to="/equipment/new"
                className="px-4 py-2 rounded-lg bg-primary-50 text-primary-700 text-sm font-semibold hover:bg-primary-100"
              >
                Ajouter un equipement
              </Link>
            </div>

            {relatedEquipmentLoading ? (
              <p className="text-sm text-gray-500">Chargement des equipements...</p>
            ) : relatedEquipmentError ? (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {relatedEquipmentError}
              </p>
            ) : relatedEquipment.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aucun equipement n'est encore associe a ce laboratoire.
              </p>
            ) : (
              <div className="space-y-3">
                {relatedEquipment.map((equipment) => (
                  <Link
                    key={equipment.id}
                    to={`/equipment/${equipment.id}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3 hover:border-primary-200 hover:bg-primary-50/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                        <Laptop size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{equipment.nom}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {equipment.modele || 'Modele non renseigne'}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-primary-700 shrink-0">Voir</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Resume</h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs uppercase tracking-wide text-gray-400">Salle</p>
                <p className="text-gray-900 font-semibold mt-1">
                  {currentLaboratory.salle || 'Non renseignee'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs uppercase tracking-wide text-gray-400">Equipements</p>
                <p className="text-gray-900 font-semibold mt-1">{relatedEquipment.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Departement</h3>
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
              <p className="text-primary-900 font-medium">
                {currentLaboratory.Department?.nom || 'Departement non assigne'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryDetail;
