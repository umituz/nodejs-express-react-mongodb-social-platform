import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";
import Spinner from "../common/Spinner";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      // Giriş yapan kullanıcının profilinin olup olmadığını kontrol et.
      if (Object.keys(profile).length > 0) {
        dashboardContent = <h3>Profili Göster</h3>;
      } else {
        // Kullanıcı giriş yaptı ama henüz profili yok.
        dashboardContent = (
          <div>
            <p className="lead text-muted">Hoşgeldiniz {user.name}</p>
            <p>Henüz profilinizi oluşturmadınız.</p>
            <Link to="/create-profile" className="btn btn-lg btn-success">
              Profil Oluştur
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard ">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1>Anasayfa</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
