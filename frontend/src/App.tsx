import { useState } from 'react'
import reactLogo from './assets/react.svg'
import SurveyEditor from './components/survey-editor';
import './App.css'

const surveyJson = {
  elements: [{
    name: "FirstName",
    title: "Enter your first name:",
    type: "text"
  }, {
    name: "LastName",
    title: "Enter your last name:",
    type: "text"
  }]
};

function App() {
  return (
    <div className="App">
      <SurveyEditor />
    </div>
  )
}

export default App
