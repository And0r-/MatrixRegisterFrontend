import React, { Component } from 'react';
import Keycloak from 'keycloak-js';
import Projects from './Projects';


class Secured extends Component {

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
                //         // alert(profile.id);
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
        if (this.state.keycloak && this.state.keycloak) {
            if (this.state.authenticated) return (
                <div>
                    <Projects keycloak={this.state.keycloak}></Projects>
                    <div>{console.log("keycloak state: ", this.state.keycloak)}</div>
                    <div>{console.log("keycloak pref name: ", this.state.keycloak.idTokenParsed.given_name)}</div>
                </div>
            ); else return (<div>Unable to authenticate!</div>)
        }
        return (
            <div>Initializing Keycloak...</div>
        );
    }
}
export default Secured;