import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { StylesManager, Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import './App.css'
import 'survey-core/defaultV2.min.css';


StylesManager.applyTheme("defaultV2");

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
  // const [count, setCount] = useState(0)
  const survey = new Model(surveyJson);

  return (
    <div className="App">
      <Survey model={survey} />
    </div>
  )
}

export default App
