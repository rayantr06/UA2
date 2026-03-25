import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/common/FormInput';
import { addRole, clearRolesError } from '../../features/roles/rolesSlice';

const schema = yup.object({
  titre: yup.string().required('Le titre est obligatoire'),
  description: yup.string().max(255, 'La description est trop longue'),
});

const RoleFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { submitting, error } = useSelector((state) => state.roles);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      titre: '',
      description: '',
    },
  });

  useEffect(() => {
    dispatch(clearRolesError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(addRole(data)).unwrap();
      reset();
      navigate('/roles');
    } catch {
      // L'erreur est deja affichee dans le slice
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-slide-in">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau role</h1>
        </div>
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6 text-gray-700">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="font-semibold">Creation d'un role</p>
            <p className="text-sm text-gray-500">Formulaire simple avec validation.</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            label="Titre*"
            name="titre"
            register={register}
            errors={errors}
            placeholder="Ex: administrateur"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows="4"
              className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Decrire le role..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/roles')}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              <Save size={18} />
              {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleFormPage;
