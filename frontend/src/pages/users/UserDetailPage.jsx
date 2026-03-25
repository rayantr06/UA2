import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, UserCircle2 } from 'lucide-react';
import { clearCurrentUser, deleteUser, fetchUserById } from '../../features/users/usersSlice';

const InfoCard = ({ title, value }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{title}</p>
    <p className="text-gray-900 mt-1 font-medium">{value || 'N/A'}</p>
  </div>
);

const UserDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUserById(id));
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, id]);

  const handleDelete = () => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      dispatch(deleteUser(id));
      navigate('/users');
    }
  };

  if (loading || !currentUser) {
    return <div className="p-10 text-center text-gray-400">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/users')}
          className="p-2 hover:bg-gray-100 rounded-full flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft size={20} />
          Retour
        </button>
        <div className="flex gap-2">
          <Link
            to={`/users/edit/${id}`}
            className="px-4 py-2 border border-gray-200 rounded-lg text-amber-600 hover:bg-amber-50 flex items-center gap-2"
          >
            <Edit2 size={18} />
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 size={18} />
            Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card p-8 text-center">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-primary-50 text-primary-600 flex items-center justify-center">
              {currentUser.photo ? (
                <img src={currentUser.photo} alt={currentUser.nom} className="w-full h-full object-cover" />
              ) : (
                <UserCircle2 size={80} />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              {currentUser.nom} {currentUser.prenom}
            </h1>
            <p className="text-gray-500 mt-1">{currentUser.email}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard title="Nom" value={currentUser.nom} />
              <InfoCard title="Prenom" value={currentUser.prenom} />
              <InfoCard title="Email" value={currentUser.email} />
              <InfoCard title="Naissance" value={currentUser.naissance} />
              <InfoCard title="Department" value={currentUser.Department?.nom || currentUser.DepartmentId} />
              <InfoCard title="Conduite" value={currentUser.conduite} />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Biographie</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {currentUser.biographie || 'Aucune biographie disponible.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Roles</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.Roles?.length ? (
                  currentUser.Roles.map((role) => (
                    <span key={role.id} className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm">
                      {role.titre}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Aucun role assigne.</p>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Matieres</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.Subjects?.length ? (
                  currentUser.Subjects.map((subject) => (
                    <span key={subject.id} className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm">
                      {subject.nom}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Aucune matiere assignee.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
