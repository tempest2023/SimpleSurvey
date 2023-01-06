import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { StylesManager, Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import './App.css'
import 'survey-core/defaultV2.min.css';
import Dashboard from './pages/Dashboard';

StylesManager.applyTheme("defaultV2");



const App = () => {
  return (
    // <SideBar/>
    // <CustomCreator />
    <Dashboard />
  );
};


export default App
