import SurveyEditor from './components/survey-editor';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/muse-dashboard/pages/Home";
import Projects from "./components/muse-dashboard/pages/Projects";
import Billing from "./components/muse-dashboard/pages/Billing";
import Profile from "./components/muse-dashboard/pages/Profile";
import SignUp from "./components/muse-dashboard/pages/SignUp";
import SignIn from "./components/muse-dashboard/pages/SignIn";
import Main from "./components/muse-dashboard/components/layout/Main";
import "./components/muse-dashboard/assets/styles/main.css";
import "./components/muse-dashboard/assets/styles/responsive.css";
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
    <BrowserRouter>
      <div className="App">
      <Switch>
        <Route path="/editor" exact component={SurveyEditor} />
        <Route path="/sign-up" exact component={SignUp} />
        <Route path="/sign-in" exact component={SignIn} />
        <Main>
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/projects" component={Projects} />
          <Route exact path="/billing" component={Billing} />
          <Route exact path="/profile" component={Profile} />
          <Redirect from="*" to="/dashboard" />
        </Main>
      </Switch>
    </div>
  </BrowserRouter>
  )
}

export default App
