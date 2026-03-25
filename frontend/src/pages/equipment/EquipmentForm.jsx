import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addEquipment, updateEquipment, fetchEquipmentById, updateEquipmentImage } from '../../features/equipment/equipmentSlice';
import { fetchLaboratories } from '../../features/laboratories/laboratoriesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

const schema = yup.object({
  nom: yup.string().required('Le nom est obligatoire'),
  modele: yup.string().oneOf(['nouveau', 'ancien', 'refait']).required('Modèle obligatoire'),
  description: yup.string(),
  LaboratoryId: yup.number().required('Laboratoire obligatoire'),
});

const EquipmentForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEquipment, loading } = useSelector((state) => state.equipment);
  const { items: labs } = useSelector((state) => state.laboratories);
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
    dispatch(fetchLaboratories({ size: 100 })); // Fetch labs for dropdown
    if (isEdit) {
      dispatch(fetchEquipmentById(id));
    }
  }, [id, dispatch, isEdit]);

  useEffect(() => {
    if (isEdit && currentEquipment) {
      reset(currentEquipment);
      if (currentEquipment.image) {
        setImagePreview(currentEquipment.image);
      }
    }
  }, [currentEquipment, reset, isEdit]);

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
      await dispatch(updateEquipment({ id, data }));
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await dispatch(updateEquipmentImage({ id, formData }));
      }
    } else {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      if (imageFile) {
        formData.append('image', imageFile);
      }
      await dispatch(addEquipment(formData));
    }
    navigate('/equipment');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-slide-in">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Modifier l\'équipement' : 'Nouvel Équipement'}
          </h1>
        </div>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'équipement*</label>
                <input
                  type="text"
                  {...register('nom')}
                  className={`input-field ${errors.nom ? 'border-red-500' : ''}`}
                  placeholder="Ex: Microscope Electronique"
                />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modèle*</label>
                <select
                  {...register('modele')}
                  className={`input-field ${errors.modele ? 'border-red-500' : ''}`}
                >
                  <option value="">Sélectionner un modèle</option>
                  <option value="nouveau">Nouveau</option>
                  <option value="ancien">Ancien</option>
                  <option value="refait">Refait</option>
                </select>
                {errors.modele && <p className="text-red-500 text-xs mt-1">{errors.modele.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Laboratoire*</label>
                <select
                  {...register('LaboratoryId')}
                  className={`input-field ${errors.LaboratoryId ? 'border-red-500' : ''}`}
                >
                  <option value="">Sélectionner un labo</option>
                  {labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>{lab.nom}</option>
                  ))}
                </select>
                {errors.LaboratoryId && <p className="text-red-500 text-xs mt-1">{errors.LaboratoryId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="Détails techniques..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image du matériel</label>
              <div className="w-full h-72 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setImageFile(null); }}
                      className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur rounded-full text-gray-600 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                    <p className="text-sm text-gray-500">Cliquez pour téléverser</p>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/equipment')} className="px-6 py-2 border border-gray-200 rounded-lg">Annuler</button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Save size={18} />
              {isEdit ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentForm;
