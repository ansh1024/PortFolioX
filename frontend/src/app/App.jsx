import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import SectionPlaceholder, { RouteNotFound } from '../pages/SectionPlaceholder.jsx';
import { dashboardSections } from './dashboardSections.js';
import AuthLayout from '../layouts/AuthLayout.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegistrationPlaceholder from '../pages/RegistrationPlaceholder.jsx';

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPlaceholder />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        {dashboardSections.map(section => section.path
          ? <Route key={section.path} path={section.path} element={<SectionPlaceholder section={section} />} />
          : <Route key="overview" index element={<SectionPlaceholder section={section} />} />)}
        <Route path="*" element={<RouteNotFound />} />
      </Route>
      <Route path="*" element={<RouteNotFound />} />
    </Routes>
  </BrowserRouter>;
}
