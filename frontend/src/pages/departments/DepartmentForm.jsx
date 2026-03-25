import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import FormInput from '../../components/common/FormInput';
import SelectInput from '../../components/common/SelectInput';
import { addDepartment, fetchDepartmentById, updateDepartment, clearCurrentDepartment } from '../../features/departments/departmentsSlice';

const schema = yup.object({
  nom: yup.string().min(2, 'Min 2 caractères').required('Le nom est obligatoire'),
  domaine: yup.string().oneOf(['sciences', 'literature', 'autre'], 'Domaine invalide').required('Le domaine est obligatoire'),
  histoire: yup.string().optional(),
});

const DepartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = !!id;

  const { currentDepartment, loading, error } = useSelector((state) => state.departments);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nom: '',
      domaine: 'sciences',
      histoire: '',
    },
  });

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchDepartmentById(id));
    } else {
      dispatch(clearCurrentDepartment());
    }
  }, [id, isEdit, dispatch]);

  useEffect(() => {
    if (isEdit && currentDepartment) {
      setValue('nom', currentDepartment.nom);
      setValue('domaine', currentDepartment.domaine);
      setValue('histoire', currentDepartment.histoire || '');
    }
  }, [currentDepartment, isEdit, setValue]);

  const onSubmit = async (data) => {
    if (isEdit) {
      await dispatch(updateDepartment({ id, data }));
    } else {
      await dispatch(addDepartment(data));
    }
    navigate('/departments');
  };

  const domaineOptions = [
    { id: 'sciences', nom: 'Sciences' },
    { id: 'literature', nom: 'Littérature' },
    { id: 'autre', nom: 'Autre' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <button
          onClick={() => navigate('/departments')}
          className="flex items-center gap-2 text-gray-500 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all font-medium"
        >
          <ChevronLeft size={20} />
          Retour
        </button>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {isEdit ? 'Modifier le département' : 'Nouveau Département'}
        </h1>
        <div className="w-24"></div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Nom du Département"
              name="nom"
              register={register}
              errors={errors}
              placeholder="Ex: Informatique"
            />
            <SelectInput
              label="Domaine"
              name="domaine"
              options={domaineOptions}
              register={register}
              errors={errors}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Histoire / Description
            </label>
            <textarea
              {...register('histoire')}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[120px]"
              placeholder="Brève histoire du département (optionnel)..."
            />
            {errors.histoire && (
              <p className="mt-1 text-xs text-red-600">{errors.histoire.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={() => navigate('/departments')}
              className="px-6 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all font-medium border border-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-lg shadow-primary-200"
            >
              <Save size={20} />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
