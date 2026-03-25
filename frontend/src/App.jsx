import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LaboratoryList from './pages/laboratories/LaboratoryList';
import LaboratoryForm from './pages/laboratories/LaboratoryForm';
import LaboratoryDetail from './pages/laboratories/LaboratoryDetail';
import EquipmentList from './pages/equipment/EquipmentList';
import EquipmentForm from './pages/equipment/EquipmentForm';
import EquipmentDetail from './pages/equipment/EquipmentDetail';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DepartmentList from './pages/departments/DepartmentList';
import DepartmentForm from './pages/departments/DepartmentForm';
import DepartmentDetail from './pages/departments/DepartmentDetail';
import SubjectList from './pages/subjects/SubjectList';
import SubjectForm from './pages/subjects/SubjectForm';
import SubjectDetail from './pages/subjects/SubjectDetail';
import ModulePlaceholderPage from './pages/shared/ModulePlaceholderPage';
import ProtectedRoute from './routes/ProtectedRoute';
import UsersListPage from './pages/users/UsersListPage';
import UserFormPage from './pages/users/UserFormPage';
import UserDetailPage from './pages/users/UserDetailPage';
import RolesListPage from './pages/roles/RolesListPage';
import RoleFormPage from './pages/roles/RoleFormPage';
import RoleDetailPage from './pages/roles/RoleDetailPage';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />

          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/departments/new" element={<DepartmentForm />} />
          <Route path="/departments/edit/:id" element={<DepartmentForm />} />
          <Route path="/departments/:id" element={<DepartmentDetail />} />

          <Route path="/subjects" element={<SubjectList />} />
          <Route path="/subjects/new" element={<SubjectForm />} />
          <Route path="/subjects/edit/:id" element={<SubjectForm />} />
          <Route path="/subjects/:id" element={<SubjectDetail />} />

          <Route path="/laboratories" element={<LaboratoryList />} />
          <Route path="/laboratories/new" element={<LaboratoryForm />} />
          <Route path="/laboratories/edit/:id" element={<LaboratoryForm />} />
          <Route path="/laboratories/:id" element={<LaboratoryDetail />} />

          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/equipment/new" element={<EquipmentForm />} />
          <Route path="/equipment/edit/:id" element={<EquipmentForm />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />

          <Route path="/users" element={<UsersListPage />} />
          <Route path="/users/new" element={<UserFormPage />} />
          <Route path="/users/edit/:id" element={<UserFormPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />

          <Route path="/roles" element={<RolesListPage />} />
          <Route path="/roles/new" element={<RoleFormPage />} />
          <Route path="/roles/:id" element={<RoleDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
