import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import SearchPage from '../pages/SearchPage.jsx';
import CollectionsPage from '../pages/CollectionsPage.jsx';
import CollectionDetailPage from '../pages/CollectionDetailPage.jsx';
import MediaDetailPage from '../pages/MediaDetailPage.jsx';
import SavedPage from '../pages/SavedPage.jsx';
import RecentPage from '../pages/RecentPage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import AppShellComp from '../components/layout/AppShellComp.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<AppShellComp />}>
        <Route path="/explore" element={<Navigate to="/search" replace />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collections/:slug" element={<CollectionDetailPage />} />
        <Route path="/media/:nasaId" element={<MediaDetailPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/recent" element={<RecentPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
