import React from 'react';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';
import SponsorshipGabar from './components/Latter';


const App = () => {
  return (
    <div>
      <Sidebar />
      <Outlet />
     <SponsorshipGabar />
  
      </div>
   
  );
};

export default App;
