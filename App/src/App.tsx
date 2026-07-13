import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './state/theme/ThemeProvider';
import AppShell from './components/layout/AppShell';

// Placeholder Pages
import Library from './pages/Library';
import Collections from './pages/Collections';
import Discover from './pages/Discover';
import Updates from './pages/Updates';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/library" replace />} />
            <Route path="/library" element={<Library />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppShell>
      </HashRouter>
    </ThemeProvider>
  );
}
