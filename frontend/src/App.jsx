import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LaboratoryList from './pages/laboratories/LaboratoryList';
import LaboratoryForm from './pages/laboratories/LaboratoryForm';
import LaboratoryDetail from './pages/laboratories/LaboratoryDetail';
import EquipmentList from './pages/equipment/EquipmentList';
import EquipmentForm from './pages/equipment/EquipmentForm';
import EquipmentDetail from './pages/equipment/EquipmentDetail';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<div className="p-6 text-2xl font-bold">Bienvenue sur EduManager Dashboard</div>} />
        
        {/* Laboratories */}
        <Route path="/laboratories" element={<LaboratoryList />} />
        <Route path="/laboratories/new" element={<LaboratoryForm />} />
        <Route path="/laboratories/edit/:id" element={<LaboratoryForm />} />
        <Route path="/laboratories/:id" element={<LaboratoryDetail />} />

        {/* Equipment */}
        <Route path="/equipment" element={<EquipmentList />} />
        <Route path="/equipment/new" element={<EquipmentForm />} />
        <Route path="/equipment/edit/:id" element={<EquipmentForm />} />
        <Route path="/equipment/:id" element={<EquipmentDetail />} />

        {/* Fallback */}
        <Route path="*" element={<div className="p-10 text-center">Page non trouvée</div>} />
      </Routes>
    </Layout>
  );
};

export default App;
