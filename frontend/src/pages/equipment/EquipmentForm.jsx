import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  addEquipment,
  clearCurrentEquipment,
  clearError,
  fetchEquipmentById,
  updateEquipment,
  updateEquipmentImage,
} from '../../features/equipment/equipmentSlice';
import { fetchLaboratories } from '../../features/laboratories/laboratoriesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

const schema = yup.object({
  nom: yup.string().required('Le nom est obligatoire'),
  modele: yup.string().oneOf(['nouveau', 'ancien', 'refait']).required('Modele obligatoire'),
  description: yup.string(),
  LaboratoryId: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Laboratoire obligatoire')
    .required('Laboratoire obligatoire'),
});

const EquipmentForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEquipment, loading, submitting, error } = useSelector((state) => state.equipment);
  const { items: labs } = useSelector((state) => state.laboratories);
  const [pendingImage, setPendingImage] = useState({
    key: null,
    file: null,
    preview: null,
  });
  const routeImageKey = isEdit ? `edit-${id}` : 'new';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nom: '',
      modele: '',
      description: '',
      LaboratoryId: '',
    },
  });

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchLaboratories({ size: 100 }));

    if (isEdit) {
      dispatch(fetchEquipmentById(id));
    } else {
      dispatch(clearCurrentEquipment());
      reset({
        nom: '',
        modele: '',
        description: '',
        LaboratoryId: '',
      });
    }

    return () => {
      dispatch(clearCurrentEquipment());
    };
  }, [dispatch, id, isEdit, reset]);

  useEffect(() => {
    if (isEdit && currentEquipment) {
      reset({
        nom: currentEquipment.nom || '',
        modele: currentEquipment.modele || '',
        description: currentEquipment.description || '',
        LaboratoryId: currentEquipment.LaboratoryId || currentEquipment.Laboratory?.id || '',
      });
    }
  }, [currentEquipment, isEdit, reset]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingImage({
        key: routeImageKey,
        file,
        preview: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleClearSelectedImage = () => {
    setPendingImage({
      key: routeImageKey,
      file: null,
      preview: null,
    });
  };

  const onSubmit = async (formValues) => {
    const payload = {
      nom: formValues.nom.trim(),
      modele: formValues.modele,
      description: formValues.description?.trim() || '',
      LaboratoryId: Number(formValues.LaboratoryId),
    };
    const imageFile = pendingImage.key === routeImageKey ? pendingImage.file : null;

    try {
      if (isEdit) {
        await dispatch(updateEquipment({ id, data: payload })).unwrap();

        if (imageFile) {
          const formData = new FormData();
          formData.append('image', imageFile);
          await dispatch(updateEquipmentImage({ id, formData })).unwrap();
        }
      } else {
        const formData = new FormData();
        formData.append('nom', payload.nom);
        formData.append('modele', payload.modele);
        formData.append('description', payload.description);
        formData.append('LaboratoryId', String(payload.LaboratoryId));

        if (imageFile) {
          formData.append('image', imageFile);
        }

        await dispatch(addEquipment(formData)).unwrap();
      }

      navigate('/equipment');
    } catch {
      // The slice stores the API error for inline display.
    }
  };

  const selectedImagePreview =
    pendingImage.key === routeImageKey ? pendingImage.preview : null;
  const displayedImage = selectedImagePreview || (isEdit ? currentEquipment?.image : null);
  const canSubmit = labs.length > 0;

  return (
    <div className="p-6 max-w-4xl mx-auto animate-slide-in">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Modifier l'equipement" : 'Nouvel equipement'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!canSubmit && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cree au moins un laboratoire avant d'ajouter un equipement.
        </div>
      )}

      {isEdit && loading && !currentEquipment ? (
        <div className="card p-8 text-center text-gray-500">Chargement de l'equipement...</div>
      ) : null}

      <div className="card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'equipement*
                </label>
                <input
                  type="text"
                  {...register('nom')}
                  className={`input-field ${errors.nom ? 'border-red-500' : ''}`}
                  placeholder="Ex: Microscope electronique"
                />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modele*</label>
                <select
                  {...register('modele')}
                  className={`input-field ${errors.modele ? 'border-red-500' : ''}`}
                >
                  <option value="">Selectionner un modele</option>
                  <option value="nouveau">Nouveau</option>
                  <option value="ancien">Ancien</option>
                  <option value="refait">Refait</option>
                </select>
                {errors.modele && (
                  <p className="text-red-500 text-xs mt-1">{errors.modele.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Laboratoire*
                </label>
                <select
                  {...register('LaboratoryId')}
                  className={`input-field ${errors.LaboratoryId ? 'border-red-500' : ''}`}
                >
                  <option value="">Selectionner un labo</option>
                  {labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.nom}
                    </option>
                  ))}
                </select>
                {errors.LaboratoryId && (
                  <p className="text-red-500 text-xs mt-1">{errors.LaboratoryId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="Details techniques..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image du materiel
              </label>
              <div className="w-full h-72 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative">
                {displayedImage ? (
                  <>
                    <img src={displayedImage} alt="Preview" className="w-full h-full object-cover" />
                    {selectedImagePreview ? (
                      <button
                        type="button"
                        onClick={handleClearSelectedImage}
                        className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur rounded-full text-gray-600 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    ) : null}
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                    <p className="text-sm text-gray-500">Cliquez pour televerser</p>
                  </div>
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/equipment')}
              className="px-6 py-2 border border-gray-200 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              {submitting ? 'Enregistrement...' : isEdit ? 'Mettre a jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentForm;
