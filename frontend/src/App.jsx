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
import ModulePlaceholderPage from './pages/shared/ModulePlaceholderPage';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />

          <Route path="/laboratories" element={<LaboratoryList />} />
          <Route path="/laboratories/new" element={<LaboratoryForm />} />
          <Route path="/laboratories/edit/:id" element={<LaboratoryForm />} />
          <Route path="/laboratories/:id" element={<LaboratoryDetail />} />

          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/equipment/new" element={<EquipmentForm />} />
          <Route path="/equipment/edit/:id" element={<EquipmentForm />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />

          <Route
            path="/users"
            element={
              <ModulePlaceholderPage
                title="Users"
                description="La base auth est en place. Ce module est pret a recevoir le CRUD utilisateurs."
              />
            }
          />
          <Route
            path="/roles"
            element={
              <ModulePlaceholderPage
                title="Roles"
                description="Cette route est deja protegee et prete pour brancher le CRUD roles."
              />
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
