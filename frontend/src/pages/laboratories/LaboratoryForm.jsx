import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addLaboratory, updateLaboratory, fetchLaboratoryById, updateLaboratoryImage } from '../../features/laboratories/laboratoriesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

const schema = yup.object({
  nom: yup.string().required('Le nom est obligatoire'),
  salle: yup.string().required('Numéro de salle obligatoire'),
  information: yup.string(),
});

const LaboratoryForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentLaboratory, loading } = useSelector((state) => state.laboratories);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchLaboratoryById(id));
    }
  }, [id, dispatch, isEdit]);

  useEffect(() => {
    if (isEdit && currentLaboratory) {
      reset(currentLaboratory);
      if (currentLaboratory.image) {
        setImagePreview(currentLaboratory.image);
      }
    }
  }, [currentLaboratory, reset, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (isEdit) {
      await dispatch(updateLaboratory({ id, data }));
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await dispatch(updateLaboratoryImage({ id, formData }));
      }
    } else {
      const formData = new FormData();
      formData.append('nom', data.nom);
      formData.append('salle', data.salle);
      formData.append('information', data.information || '');
      if (imageFile) {
        formData.append('image', imageFile);
      }
      await dispatch(addLaboratory(formData));
    }
    navigate('/laboratories');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-slide-in">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Modifier le laboratoire' : 'Nouveau Laboratoire'}
          </h1>
        </div>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Info */}
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
                {errors.salle && <p className="text-red-500 text-xs mt-1">{errors.salle.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Information / Description
                </label>
                <textarea
                  {...register('information')}
                  rows="4"
                  className="input-field resize-none"
                  placeholder="Détails supplémentaires..."
                />
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image du laboratoire
              </label>
              <div className="relative group">
                <div className="w-full h-64 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur shadow-sm rounded-full text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <div className="mx-auto w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-400 mb-3">
                        <Upload size={24} />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Cliquez pour téléverser</p>
                      <p className="text-xs text-gray-400">PNG, JPG jusqu'à 5MB</p>
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
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              {isEdit ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaboratoryForm;
