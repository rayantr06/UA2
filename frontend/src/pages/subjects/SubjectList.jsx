import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, BadgeCheck, BadgeAlert } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import { deleteSubject, fetchSubjects } from '../../features/subjects/subjectsSlice';

const SubjectList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, currentPage, totalPages, loading, error } = useSelector(
    (state) => state.subjects
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchSubjects({ page, search: searchTerm }));
  }, [dispatch, page, searchTerm]);

  const handleDelete = (subject) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la matière ${subject.nom} ?`)) {
      dispatch(deleteSubject(subject.id));
    }
  };

  const columns = [
    { label: 'Code', key: 'code' },
    { label: 'Nom', key: 'nom' },
    { 
      label: 'Statut', 
      key: 'statut',
      render: (val) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          val === 'requis' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {val === 'requis' ? <BadgeAlert size={14} /> : <BadgeCheck size={14} />}
          {val}
        </span>
      )
    },
  ];

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Matières</h1>
          <p className="text-gray-500 mt-2 font-medium">Gérez le catalogue des cours et matières.</p>
        </div>
        <button
          onClick={() => navigate('/subjects/new')}
          className="flex items-center gap-2 bg-primary-600 text-white px-5 py-3 rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-lg shadow-primary-200"
        >
          <PlusCircle size={20} />
          Nouvelle Matière
        </button>
      </div>

      <div className="mb-8 relative max-w-lg">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Rechercher une matière..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full pl-11 pr-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 bg-white shadow-sm transition-all"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl font-medium">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={items}
        onEdit={(subject) => navigate(`/subjects/edit/${subject.id}`)}
        onDelete={handleDelete}
        loading={loading}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default SubjectList;
