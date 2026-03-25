import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearAuthError, loginUser } from '../../features/auth/authSlice';

const schema = yup.object({
  email: yup.string().email('Email invalide').required("L'email est obligatoire"),
  mot_de_passe: yup.string().required('Le mot de passe est obligatoire'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      mot_de_passe: '',
    },
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md card p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-200">
            <ShieldCheck size={28} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="text-sm text-gray-500 mt-2">
            Connectez-vous pour acceder a EduManager
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="exemple@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              {...register('mot_de_passe')}
              className={`input-field ${errors.mot_de_passe ? 'border-red-500' : ''}`}
              placeholder="Votre mot de passe"
            />
            {errors.mot_de_passe && (
              <p className="text-red-500 text-xs mt-1">{errors.mot_de_passe.message}</p>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
