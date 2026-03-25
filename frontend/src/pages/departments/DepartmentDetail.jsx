import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Edit2, BookOpen, Users, Library, Globe } from 'lucide-react';
import { fetchDepartmentById } from '../../features/departments/departmentsSlice';
import api from '../../api/axios';

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentDepartment, loading, error } = useSelector((state) => state.departments);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartmentById(id));

    // Charger les matières du département
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const res = await api.get(`/departments/${id}/subjects`);
        setSubjects(res.data.data || []);
      } catch {
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [dispatch, id]);

  const domainColors = {
    sciences: 'bg-blue-50 text-blue-600',
    literature: 'bg-purple-50 text-purple-600',
    autre: 'bg-gray-50 text-gray-600',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentDepartment) {
    return (
      <div className="p-8 text-center text-gray-500">Département introuvable.</div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/departments')}
          className="flex items-center gap-2 text-gray-500 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all font-medium"
        >
          <ChevronLeft size={20} />
          Retour
        </button>
        <button
          onClick={() => navigate(`/departments/edit/${id}`)}
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
            <Library size={32} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentDepartment.nom}</h1>
            {currentDepartment.domaine && (
              <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${domainColors[currentDepartment.domaine] || domainColors.autre}`}>
                <Globe size={12} />
                {currentDepartment.domaine}
              </span>
            )}
          </div>
        </div>

        {currentDepartment.histoire && (
          <div className="border-t border-gray-50 pt-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Histoire</h3>
            <p className="text-gray-600 leading-relaxed">{currentDepartment.histoire}</p>
          </div>
        )}
      </div>

      {/* Matières du département */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={20} className="text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Matières du département</h2>
          <span className="ml-auto bg-primary-50 text-primary-600 text-sm font-bold px-3 py-1 rounded-full">
            {subjects.length}
          </span>
        </div>

        {loadingSubjects ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : subjects.length === 0 ? (
          <p className="text-gray-400 italic text-center py-8">Aucune matière liée à ce département.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => navigate(`/subjects/${subject.id}`)}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                  <BookOpen size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">{subject.nom}</p>
                  <p className="text-xs text-gray-400">{subject.code}</p>
                </div>
                <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${
                  subject.statut === 'requis' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {subject.statut}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDetail;
