import React, { Component } from 'react';
import Keycloak from 'keycloak-js';


import {
    Route,
} from "react-router-dom";

class Secured2 extends Component {

    constructor(props) {
        super(props);
        this.state = { keycloak: null, authenticated: false, profile: null };
    }

    componentDidMount() {
        const keycloak = new Keycloak('/keycloak.json');
        keycloak.init({ onLoad: 'login-required' }).then(authenticated => {

            if (authenticated) {
                window.accessToken = keycloak.token;
                // keycloak.loadUserProfile()
                //     .then(function (profile) {

                //         // alert(profile.firstName);
                // alert(keycloak.token);
                // alert(JSON.stringify(keycloak, null, "  "));
                //         return profile.firstName;

                //     }).catch(function () {
                //         alert('Failed to load user profile');
                //     });

                //      console.log("test: ", keycloak.profile);
                this.setState({ keycloak: keycloak, authenticated: true });
            }
        })
    }

    render() {
        const { component: Component, ...rest } = this.props;
        if (this.state.keycloak) {
            if (this.state.authenticated) return (
                <div>
                    <Route {...rest} render={props => (
                        <Component {...props} keycloak={this.state.keycloak} />
                    )} />
                </div>

            ); else return (<div>Unable to authenticate!</div>)
        }
        return (
            <div>Initializing Keycloak...</div>
        );
    }
}
export default Secured2;