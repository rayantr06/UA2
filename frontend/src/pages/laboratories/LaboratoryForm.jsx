import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  addLaboratory,
  clearCurrentLaboratory,
  clearError,
  fetchLaboratoryById,
  updateLaboratory,
  updateLaboratoryImage,
} from '../../features/laboratories/laboratoriesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

const schema = yup.object({
  nom: yup.string().required('Le nom est obligatoire'),
  salle: yup.string().required('Numero de salle obligatoire'),
  information: yup.string(),
});

const LaboratoryForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentLaboratory, loading, submitting, error } = useSelector(
    (state) => state.laboratories
  );
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
      salle: '',
      information: '',
    },
  });

  useEffect(() => {
    dispatch(clearError());

    if (isEdit) {
      dispatch(fetchLaboratoryById(id));
    } else {
      dispatch(clearCurrentLaboratory());
      reset({
        nom: '',
        salle: '',
        information: '',
      });
    }

    return () => {
      dispatch(clearCurrentLaboratory());
    };
  }, [dispatch, id, isEdit, reset]);

  useEffect(() => {
    if (isEdit && currentLaboratory) {
      reset({
        nom: currentLaboratory.nom || '',
        salle: currentLaboratory.salle || '',
        information: currentLaboratory.information || '',
      });
    }
  }, [currentLaboratory, isEdit, reset]);

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
      salle: formValues.salle.trim(),
      information: formValues.information?.trim() || '',
    };

    const imageFile = pendingImage.key === routeImageKey ? pendingImage.file : null;

    try {
      if (isEdit) {
        await dispatch(updateLaboratory({ id, data: payload })).unwrap();

        if (imageFile) {
          const formData = new FormData();
          formData.append('nom', payload.nom);
          formData.append('image', imageFile);
          await dispatch(updateLaboratoryImage({ id, formData })).unwrap();
        }
      } else {
        const formData = new FormData();
        formData.append('nom', payload.nom);
        formData.append('salle', payload.salle);
        formData.append('information', payload.information);

        if (imageFile) {
          formData.append('image', imageFile);
        }

        await dispatch(addLaboratory(formData)).unwrap();
      }

      navigate('/laboratories');
    } catch {
      // The slice stores the API error for inline display.
    }
  };

  const selectedImagePreview =
    pendingImage.key === routeImageKey ? pendingImage.preview : null;
  const displayedImage = selectedImagePreview || (isEdit ? currentLaboratory?.image : null);

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
            {isEdit ? 'Modifier le laboratoire' : 'Nouveau laboratoire'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isEdit && loading && !currentLaboratory ? (
        <div className="card p-8 text-center text-gray-500">Chargement du laboratoire...</div>
      ) : null}

      <div className="card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du laboratoire*
                </label>
                <input
                  type="text"
                  {...register('nom')}
                  className={`input-field ${errors.nom ? 'border-red-500' : ''}`}
                  placeholder="Ex: Labo de Physique"
                />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salle*
                </label>
                <input
                  type="text"
                  {...register('salle')}
                  className={`input-field ${errors.salle ? 'border-red-500' : ''}`}
                  placeholder="Ex: A-302"
                />
                {errors.salle && (
                  <p className="text-red-500 text-xs mt-1">{errors.salle.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Information / Description
                </label>
                <textarea
                  {...register('information')}
                  rows="4"
                  className="input-field resize-none"
                  placeholder="Details supplementaires..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image du laboratoire
              </label>
              <div className="relative group">
                <div className="w-full h-64 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative">
                  {displayedImage ? (
                    <>
                      <img src={displayedImage} alt="Preview" className="w-full h-full object-cover" />
                      {selectedImagePreview ? (
                        <button
                          type="button"
                          onClick={handleClearSelectedImage}
                          className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur shadow-sm rounded-full text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <div className="mx-auto w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-400 mb-3">
                        <Upload size={24} />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Cliquez pour televerser</p>
                      <p className="text-xs text-gray-400">PNG, JPG jusqu'a 5 MB</p>
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
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/laboratories')}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
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

export default LaboratoryForm;
