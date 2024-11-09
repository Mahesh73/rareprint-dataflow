import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './component/Header';
import { useState } from 'react';
import SideMenu from './component/SideMenu';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div className="app-container">
      <Header toggleMenu={toggleMenu} />
      <SideMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
    </div>
  );
}

export default App;
