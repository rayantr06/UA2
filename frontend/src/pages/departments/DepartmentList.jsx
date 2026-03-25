import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Library, BookOpen, Globe } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import { deleteDepartment, fetchDepartments } from '../../features/departments/departmentsSlice';

const DepartmentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, currentPage, totalPages, loading, error } = useSelector(
    (state) => state.departments
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchDepartments({ page, search: searchTerm }));
  }, [dispatch, page, searchTerm]);

  const handleDelete = (dept) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le département ${dept.nom} ?`)) {
      dispatch(deleteDepartment(dept.id));
    }
  };

  const domainIcons = {
    sciences: <Library size={14} />,
    literature: <BookOpen size={14} />,
    autre: <Globe size={14} />,
  };

  const columns = [
    { label: 'Nom', key: 'nom' },
    { 
      label: 'Domaine', 
      key: 'domaine',
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-600">
          {domainIcons[val] || domainIcons.autre}
          {val || 'général'}
        </span>
      )
    },
    { 
      label: 'Date Création', 
      key: 'createdAt',
      render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A'
    },
  ];

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Départements</h1>
          <p className="text-gray-500 mt-2 font-medium">Gérez la structure organisationnelle du campus.</p>
        </div>
        <button
          onClick={() => navigate('/departments/new')}
          className="flex items-center gap-2 bg-primary-600 text-white px-5 py-3 rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-lg shadow-primary-200"
        >
          <PlusCircle size={20} />
          Nouveau Département
        </button>
      </div>

      <div className="mb-8 relative max-w-lg">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Rechercher un département..."
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
        onEdit={(dept) => navigate(`/departments/edit/${dept.id}`)}
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

export default DepartmentList;
