import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import SectionPlaceholder, { RouteNotFound } from '../pages/SectionPlaceholder.jsx';
import { dashboardSections } from './dashboardSections.js';

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
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
