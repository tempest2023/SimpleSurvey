import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { StylesManager, Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import './App.css'
import 'survey-core/defaultV2.min.css';
import CustomCreator from "./components/CustomCreator"
import Dashboard from './pages/Dashboard';
import SideBar from './components/Sidebar'

StylesManager.applyTheme("defaultV2");



const App = () => {
  return (
    // <SideBar/>
    <CustomCreator />
    // <Dashboard />
  );
};


export default App
