import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, UserCircle2 } from 'lucide-react';
import api from '../../api/axios';
import {
  assignUserRoles,
  assignUserSubjects,
  clearCurrentUser,
  clearUsersError,
  createUser,
  updateUser,
  updateUserPhoto,
} from '../../features/users/usersSlice';

const nameRegex = /^[a-zA-Z]{4,}$/;

const schema = yup.object({
  nom: yup.string().matches(nameRegex, "Le nom n'est pas conforme").required('Le nom est obligatoire'),
  prenom: yup.string().matches(nameRegex, "Le prenom n'est pas conforme").required('Le prenom est obligatoire'),
  email: yup.string().email('Email invalide').required("L'email est obligatoire"),
  mot_de_passe: yup.string().when('$isEdit', {
    is: true,
    then: (value) =>
      value
        .required('Le mot de passe est obligatoire')
        .min(8, 'Au moins 8 caracteres')
        .matches(/\d/, 'Au moins un chiffre')
        .matches(/[a-z]/, 'Au moins une minuscule')
        .matches(/[A-Z]/, 'Au moins une majuscule')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Au moins un caractere special'),
    otherwise: (value) =>
      value
        .required('Le mot de passe est obligatoire')
        .min(8, 'Au moins 8 caracteres')
        .matches(/\d/, 'Au moins un chiffre')
        .matches(/[a-z]/, 'Au moins une minuscule')
        .matches(/[A-Z]/, 'Au moins une majuscule')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Au moins un caractere special'),
  }),
  naissance: yup.string().nullable(),
  biographie: yup.string().nullable(),
  conduite: yup.string().nullable(),
  DepartmentId: yup.string().nullable(),
});

const UserFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.users);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const conduiteOptions = useMemo(() => ['Excellente', 'Bonne', 'Passable'], []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema, { context: { isEdit } }),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      mot_de_passe: '',
      naissance: '',
      biographie: '',
      conduite: '',
      DepartmentId: '',
    },
  });

  useEffect(() => {
    dispatch(clearUsersError());
  }, [dispatch]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [departmentsResponse, subjectsResponse] = await Promise.all([
          api.get('/departments'),
          api.get('/subjects'),
        ]);

        setDepartments(departmentsResponse.data.data?.departments || []);
        setSubjects(subjectsResponse.data.data?.subjects || []);
      } catch {
        setDepartments([]);
        setSubjects([]);
      }

      try {
        const rolesResponse = await api.get('/roles');
        setRoles(rolesResponse.data.data || []);
      } catch {
        setRoles([]);
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    if (!isEdit) {
      return () => {
        dispatch(clearCurrentUser());
      };
    }

    dispatch(clearCurrentUser());

    const loadCurrentUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        const user = response.data.data;

        reset({
          nom: user.nom || '',
          prenom: user.prenom || '',
          email: user.email || '',
          mot_de_passe: '',
          naissance: user.naissance || '',
          biographie: user.biographie || '',
          conduite: user.conduite || '',
          DepartmentId: user.DepartmentId ? String(user.DepartmentId) : '',
        });

        setSelectedRoles((user.Roles || []).map((role) => role.id));
        setSelectedSubjects((user.Subjects || []).map((subject) => subject.id));
        setPhotoPreview(user.photo || '');
      } catch {
        // L'erreur reseau ou API est geree au submit ou via l'ecran detail.
      }
    };

    loadCurrentUser();

    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, id, isEdit, reset]);

  const handleIdsChange = (setter) => (event) => {
    const ids = Array.from(event.target.selectedOptions).map((option) => Number(option.value));
    setter(ids);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        const payload = { ...data };

        await dispatch(updateUser({ id, data: payload })).unwrap();
        if (photoFile) {
          const photoData = new FormData();
          photoData.append('photo', photoFile);
          await dispatch(updateUserPhoto({ id, formData: photoData })).unwrap();
        }
        await dispatch(assignUserRoles({ id, ids: selectedRoles })).unwrap().catch(() => {});
        await dispatch(assignUserSubjects({ id, ids: selectedSubjects })).unwrap().catch(() => {});
      } else {
        const formData = new FormData();
        formData.append('nom', data.nom);
        formData.append('prenom', data.prenom);
        formData.append('email', data.email);
        formData.append('mot_de_passe', data.mot_de_passe);
        formData.append('naissance', data.naissance || '');
        formData.append('biographie', data.biographie || '');
        formData.append('conduite', data.conduite || '');
        formData.append('DepartmentId', data.DepartmentId || '');

        if (photoFile) {
          formData.append('photo', photoFile);
        }

        await dispatch(createUser(formData)).unwrap();

        const usersResponse = await api.get(`/users?page=1&size=100&search=${encodeURIComponent(data.nom)}`);
        const createdUser = (usersResponse.data.data?.users || []).find((user) => user.email === data.email);

        if (createdUser?.id) {
          if (selectedRoles.length > 0) {
            await dispatch(assignUserRoles({ id: createdUser.id, ids: selectedRoles })).unwrap().catch(() => {});
          }

          if (selectedSubjects.length > 0) {
            await dispatch(assignUserSubjects({ id: createdUser.id, ids: selectedSubjects })).unwrap().catch(() => {});
          }
        }
      }

      navigate('/users');
    } catch {
      // Le message est deja gere dans le slice
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-slide-in">
      <div className="mb-8 flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Modifier l'utilisateur" : 'Nouvel utilisateur'}
        </h1>
      </div>

      <div className="card p-8">
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom*</label>
                <input {...register('nom')} className={`input-field ${errors.nom ? 'border-red-500' : ''}`} />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prenom*</label>
                <input {...register('prenom')} className={`input-field ${errors.prenom ? 'border-red-500' : ''}`} />
                {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input type="email" {...register('email')} className={`input-field ${errors.email ? 'border-red-500' : ''}`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEdit ? 'Nouveau mot de passe' : 'Mot de passe*'}
                </label>
                <input type="password" {...register('mot_de_passe')} className={`input-field ${errors.mot_de_passe ? 'border-red-500' : ''}`} />
                {errors.mot_de_passe && <p className="text-red-500 text-xs mt-1">{errors.mot_de_passe.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naissance</label>
                <input type="date" {...register('naissance')} className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conduite</label>
                <select {...register('conduite')} className="input-field">
                  <option value="">Choisir</option>
                  {conduiteOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Departement</label>
                <select {...register('DepartmentId')} className="input-field">
                  <option value="">Aucun</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                <textarea {...register('biographie')} rows="4" className={`input-field resize-none ${errors.biographie ? 'border-red-500' : ''}`} />
                {errors.biographie && <p className="text-red-500 text-xs mt-1">{errors.biographie.message}</p>}
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roles</label>
                  <select
                    multiple
                    value={selectedRoles.map(String)}
                    onChange={handleIdsChange(setSelectedRoles)}
                    className="input-field min-h-32"
                    disabled={roles.length === 0}
                  >
                    {roles.length === 0 ? (
                      <option value="">Aucun role disponible</option>
                    ) : (
                      roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.titre}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {roles.length === 0
                      ? "La base actuelle ne contient pas encore de role utilisable."
                      : 'Maintiens Ctrl pour selectionner plusieurs roles.'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matieres</label>
                  <select
                    multiple
                    value={selectedSubjects.map(String)}
                    onChange={handleIdsChange(setSelectedSubjects)}
                    className="input-field min-h-32"
                    disabled={subjects.length === 0}
                  >
                    {subjects.length === 0 ? (
                      <option value="">Aucune matiere disponible</option>
                    ) : (
                      subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.nom}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {subjects.length === 0
                      ? "La base actuelle ne contient pas encore de matiere."
                      : 'Maintiens Ctrl pour selectionner plusieurs matieres.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <div className="w-full h-72 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center relative">
                {photoPreview ? (
                  <img src={photoPreview} alt="Apercu utilisateur" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <UserCircle2 size={72} className="mx-auto mb-3" />
                    <p className="text-sm">Aucune photo selectionnee</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePhotoChange} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Save size={18} />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormPage;
