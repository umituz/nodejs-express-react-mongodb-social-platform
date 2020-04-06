import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./helpers/setAuthToken";

import store from "./store";

// Oluşturduğum komponentlerim.
import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/create-profile/CreateProfile";

// Oluşturduğum action yapılarım...
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

import "./App.css";

// TOKEN OLUP OLMADIĞINI KONTROL ET!
if (localStorage.jwtToken) {
  // Header Authorization için token ata.
  setAuthToken(localStorage.jwtToken);
  // Token'i çözümle ve kullanıcı bilgilerini ve token sona erme süresini al.
  const decoded = jwt_decode(localStorage.jwtToken);
  // Kullanıcıyı ayarla. MEVCUT_KULLANICI'nın bilgileri için.
  store.dispatch(setCurrentUser(decoded));

  // Token yaşam süresini kontrol et.
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Yaşam süresi şu anki zamandan küçükse çıkış yap!
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
    // Standart js yönlendirme
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
