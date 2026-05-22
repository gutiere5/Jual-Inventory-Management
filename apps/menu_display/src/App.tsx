import { Outlet } from 'react-router-dom';
import { logo } from '@repo/assets';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <a href={import.meta.env.VITE_DASHBOARD_URL as string} className="logo-link">
        <img src={logo} alt="Store Logo" className="store-logo" />
      </a>
      <Outlet />
    </div>
  );
}

export default App;
