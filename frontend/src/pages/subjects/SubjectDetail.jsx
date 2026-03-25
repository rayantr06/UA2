import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Edit2, BookOpen, Users, BadgeCheck, BadgeAlert, Library } from 'lucide-react';
import { fetchSubjectById } from '../../features/subjects/subjectsSlice';
import api from '../../api/axios';

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentSubject, loading, error } = useSelector((state) => state.subjects);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    dispatch(fetchSubjectById(id));

    // Charger les utilisateurs inscrits à cette matière
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await api.get(`/subjects/${id}/users`);
        setUsers(res.data.data || []);
      } catch {
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentSubject) {
    return (
      <div className="p-8 text-center text-gray-500">Matière introuvable.</div>
    );
  }

  const isRequis = currentSubject.statut === 'requis';

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/subjects')}
          className="flex items-center gap-2 text-gray-500 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all font-medium"
        >
          <ChevronLeft size={20} />
          Retour
        </button>
        <button
          onClick={() => navigate(`/subjects/edit/${id}`)}
          className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-all font-semibold"
        >
          <Edit2 size={18} />
          Modifier
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl">
          {error}
        </div>
      )}

      {/* Carte principale */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
        <div className="flex items-start gap-5 mb-8">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <BookOpen size={32} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentSubject.nom}</h1>
            <p className="text-gray-400 mt-1 font-mono text-sm">{currentSubject.code}</p>
            <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isRequis ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {isRequis ? <BadgeAlert size={12} /> : <BadgeCheck size={12} />}
              {currentSubject.statut}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 border-t border-gray-50 pt-6">
          {currentSubject.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{currentSubject.description}</p>
            </div>
          )}
          {currentSubject.Department && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Département</h3>
              <div
                onClick={() => navigate(`/departments/${currentSubject.Department.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-primary-50 cursor-pointer transition-all"
              >
                <Library size={18} className="text-primary-600" />
                <span className="font-semibold text-gray-700">{currentSubject.Department.nom}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Utilisateurs inscrits */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <Users size={20} className="text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Utilisateurs inscrits</h2>
          <span className="ml-auto bg-primary-50 text-primary-600 text-sm font-bold px-3 py-1 rounded-full">
            {users.length}
          </span>
        </div>

        {loadingUsers ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-400 italic text-center py-8">Aucun utilisateur inscrit à cette matière.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-4 py-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                  {user.nom?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.nom} {user.prenom}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
