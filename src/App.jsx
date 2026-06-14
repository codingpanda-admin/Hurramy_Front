import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Upload from './pages/Upload';
import VideoPlayer from './pages/VideoPlayer';
import CampaignList from './pages/CampaignList';
import CampaignDetail from './pages/CampaignDetail';
import CreateCampaign from './pages/CreateCampaign';
import Profile from './pages/Profile';
import MyVideos from './pages/MyVideos';
import Following from './pages/Following';
import Favorites from './pages/Favorites';
import Trending from './pages/Trending';
import AdminPanel from './pages/AdminPanel';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ShortDramas from './pages/ShortDramas';
import AIGeneratorPage from './pages/AIGeneratorPage'; // <-- 1. IMPORTA LA PÁGINA
import LiveBroadcast from './pages/LiveBroadcast';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/watch/:id" element={<VideoPlayer />} />
      <Route path="/campaigns" element={<CampaignList />} />
      <Route path="/campaign/:id" element={<CampaignDetail />} />
      <Route path="/create-campaign" element={<CreateCampaign />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-videos" element={<MyVideos />} />
      <Route path="/following" element={<Following />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/trending" element={<Trending />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/short-dramas" element={<ShortDramas />} />
      <Route path="/ai-generator" element={<AIGeneratorPage />} /> {/* <-- 2. AGREGA LA RUTA */}
      <Route path="/live" element={<LiveBroadcast />} />
    </Routes>
  );
}

export default App;
