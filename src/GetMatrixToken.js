// https://matrix.agilator.ch/_matrix/client/r0/login/sso/redirect?redirectUrl=http://localhost:3000/getMatrixToken

import React, { Component } from 'react';
import { Redirect } from "react-router-dom";





class GetMatrixToken extends Component {
    
    
    render() {
        const query = new URLSearchParams(this.props.location.search);
        const Mtoken = query.get('loginToken');
        window.localStorage.setItem('Mtoken', Mtoken);

        
        return <Redirect to="/setMatrixAccess" />
        // return (
        //     <div>{Mtoken}</div>
            
        // )
    }

}

export default GetMatrixToken;