import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, ShieldCheck, Users } from 'lucide-react';
import { clearCurrentRole, deleteRole, fetchRoleById, fetchRoleUsers } from '../../features/roles/rolesSlice';

const RoleDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRole, currentUsers, loading } = useSelector((state) => state.roles);

  useEffect(() => {
    dispatch(fetchRoleById(id));
    dispatch(fetchRoleUsers(id));

    return () => {
      dispatch(clearCurrentRole());
    };
  }, [dispatch, id]);

  const handleDelete = () => {
    if (window.confirm('Supprimer ce role ?')) {
      dispatch(deleteRole(id))
        .unwrap()
        .then(() => navigate('/roles'))
        .catch(() => {
          // L'erreur est deja portee par le slice
        });
    }
  };

  if (loading || !currentRole) {
    return <div className="p-10 text-center text-gray-400">Chargement...</div>;
  }

  const users = currentUsers.length ? currentUsers : currentRole.Users || [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigate('/roles')} className="p-2 hover:bg-gray-100 rounded-full flex items-center gap-2 text-gray-600">
          <ArrowLeft size={20} /> Retour
        </button>
        <button onClick={handleDelete} className="px-4 py-2 border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2">
          <Trash2 size={18} /> Supprimer
        </button>
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Detail du role</p>
            <h1 className="text-3xl font-bold text-gray-900">{currentRole.titre}</h1>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed">{currentRole.description || 'Aucune description pour ce role.'}</p>
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-2 mb-6">
          <Users size={20} className="text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Utilisateurs associes</h2>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-400">Aucun utilisateur associe a ce role.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <p className="font-semibold text-gray-900">{user.prenom} {user.nom}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Link to="/roles/new" className="btn-primary inline-flex items-center gap-2">
          <ShieldCheck size={18} />
          Ajouter un autre role
        </Link>
      </div>
    </div>
  );
};

export default RoleDetailPage;
