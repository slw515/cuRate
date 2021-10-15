import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navigation from "./components/Navigation";
import BottomBand from "./components/BottomBand";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
import { UserAuthProvider } from "./contextComponents/auth";
function App() {
  return (
    <UserAuthProvider>
      <Router>
        <Navigation></Navigation>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/register" component={Register}></Route>
        <BottomBand></BottomBand>
      </Router>
    </UserAuthProvider>
  );
}

export default App;
