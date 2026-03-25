import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import FormInput from '../../components/common/FormInput';
import SelectInput from '../../components/common/SelectInput';
import { addSubject, fetchSubjectById, updateSubject, clearCurrentSubject } from '../../features/subjects/subjectsSlice';

const schema = yup.object({
  nom: yup.string().required('Le nom est obligatoire'),
  code: yup.string().required('Le code est obligatoire'),
  statut: yup.string().oneOf(['requis', 'optionnel'], 'Statut invalide').required('Le statut est obligatoire'),
  description: yup.string().optional(),
});

const SubjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = !!id;

  const { currentSubject, loading, error } = useSelector((state) => state.subjects);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nom: '',
      code: '',
      statut: 'requis',
      description: '',
    },
  });

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchSubjectById(id));
    } else {
      dispatch(clearCurrentSubject());
    }
  }, [id, isEdit, dispatch]);

  useEffect(() => {
    if (isEdit && currentSubject) {
      setValue('nom', currentSubject.nom);
      setValue('code', currentSubject.code);
      setValue('statut', currentSubject.statut);
      setValue('description', currentSubject.description || '');
    }
  }, [currentSubject, isEdit, setValue]);

  const onSubmit = async (data) => {
    if (isEdit) {
      await dispatch(updateSubject({ id, data }));
    } else {
      await dispatch(addSubject(data));
    }
    navigate('/subjects');
  };

  const statutOptions = [
    { id: 'requis', nom: 'Requis' },
    { id: 'optionnel', nom: 'Optionnel' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <button
          onClick={() => navigate('/subjects')}
          className="flex items-center gap-2 text-gray-500 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all font-medium"
        >
          <ChevronLeft size={20} />
          Retour
        </button>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {isEdit ? 'Modifier la matière' : 'Nouvelle Matière'}
        </h1>
        <div className="w-24"></div> 
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 transition-all duration-300">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Code Matière"
              name="code"
              register={register}
              errors={errors}
              placeholder="Ex: INFO-101"
            />
            <FormInput
              label="Nom de la Matière"
              name="nom"
              register={register}
              errors={errors}
              placeholder="Ex: Algorithmique"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <SelectInput
              label="Statut"
              name="statut"
              options={statutOptions}
              register={register}
              errors={errors}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
             <textarea 
                {...register('description')}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[120px]"
                placeholder="Description du cours..."
             />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-50 pt-8 mt-4">
            <button
              type="button"
              onClick={() => navigate('/subjects')}
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

export default SubjectForm;
