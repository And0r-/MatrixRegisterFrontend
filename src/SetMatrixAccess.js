import React, { Component } from 'react';
import axios from 'axios';
import stage_config from './config';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { withStyles } from '@mui/styles';
import CardHeader from '@mui/material/CardHeader';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

// const sdk = require('matrix-js-sdk');

// import ProjectForm from './ProjectForm';


const useStyles = {
    site: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
        margin: '16px',
        width: '600px',
        backgroundColor: 'lightgray',
    },

    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'black',
    },

    background: {
        // backgroundColor: 'black',
    },

    text: {
        whiteSpace: 'pre-line',
    },

    root: {
        height: '100%',


    },

    breit: {
        width: '568px',
    },

    parentFlexRight: {
        display: "flex",
        justifyContent: "flex-end"
    },

    button: {
        backgroundColor: 'gray',
    },

    card: {
        backgroundColor: "secondary"
    },
};

var axiosInstance = axios.create({
    // baseURL: stage_config.apiGateway.URL
});

axiosInstance.interceptors.request.use(
    config => {
        const token = window.accessToken ? window.accessToken : 'dummy_token';
        config.headers['Authorization'] = 'Bearer ' + token;
        return config;
    },
    error => {
        Promise.reject(error)
    });

axiosInstance.interceptors.response.use((response) => {
    return response
}, function (error) {
    return Promise.reject(error);
});

class Projects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            projectList: [{}],
            isLoaded: true,
        };
    }

    componentDidMount() {
        axiosInstance.get(stage_config.apiGateway.URL + '/test2')
            .then(res => res.data)
            .then(
                (result) => {
                    if ("error" in result) {
                        this.setState({
                            error: { message: result.error },
                        });
                    } else {
                        console.log(result);
                        this.setState({
                            projectList: result,
                            isLoaded: false
                        });
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        error
                    });
                }
            );

            axiosInstance.get(stage_config.apiGateway.URL + '/matrix_user_setup/'+window.localStorage.getItem("Mtoken"))
            .then(res => res.data)
            .then(
                (result) => {
                    if ("error" in result) {
                        this.setState({
                            error: { message: result.error },
                        });
                    } else {
                        console.log(result);
                        this.setState({
                            projectList: result,
                            isLoaded: false
                        });
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        error
                    });
                }
            );




        
    }

    createList(projectList) {
        const { classes } = this.props;
        let projectListHtml = [];

        // alert(JSON.stringify(projectList, null, "  "));

        for (let i = 0; i < projectList.length; i++) {
            console.log(projectList[i].title);

            var videoHtml = ""
            if (projectList[i].video) {
                videoHtml = <CardContent><iframe width="560" height="315" src={projectList[i].video} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <br /></CardContent>;
            }

            projectListHtml.push(
                // <li key={i}>
                <Card className={classes.site} key={i}>
                    <CardHeader title={projectList[i].title} />
                    <CardContent>
                        <span className={classes.text}>{projectList[i].text}</span>
                    </CardContent>
                    {videoHtml}
                    <CardContent className={classes.breit}>
                        <span>Website: <a href={projectList[i].url}>{projectList[i].url}</a></span><br />
                        <span>Contact: {projectList[i].contact.join(', ')}</span>
                    </CardContent>
                    <CardActions className={classes.breit + ' ' + classes.parentFlexRight} >
                        <Button size="small" variant="contained" color="primary" startIcon={<EditIcon />}>Edit</Button>
                        <Button size="small" variant="contained" color="secondary" startIcon={<DeleteIcon />}>Delete</Button>
                    </CardActions>
                </Card>
                // </li>
            );
        }
        return projectListHtml;
    }

    render() {
        const { projectList, error, isLoaded } = this.state;
        const { classes } = this.props;

        // const client = sdk.createClient({
        //     baseUrl: `https://matrix.agilator.ch`,
        //     // accessToken: req.kauth.grant.access_token
        //     // sessionStore: new sdk.WebStorageSessionStore(localStorage),
        //     // cryptoStore: new LocalStorageCryptoStore(localStorage),
        //     // deviceId: 'Test_Bot',
        //   });
        //   client.startClient();
        
        //   alert("m.login.sso");

        return (
            <div><a href="https://matrix.agilator.ch/_matrix/client/r0/login/sso/redirect?redirectUrl=http://localhost:3000/getMatrixToken">https://matrix.agilator.ch/_matrix/client/r0/login/sso/redirect?redirectUrl=http://localhost:3000/getMatrixToken</a></div>
        )

          

        if (error) {
            return <div >
                Error: {error.message}
            </div>;
        }

        if (isLoaded) {
            return <div >
                Loading...
            </div>;
        }

        if (projectList) {
            // alert(window.localStorage.getItem("Mtoken"))
            // console.log("Matrix AccessToken ", client.getAccessToken());
            console.log("project, userdata: ", this.props.keycloak);
            return (

                <div className={classes.container + ' ' + classes.background}>
                    <Card className={classes.site}>
                        <CardHeader title="IOT Project Overview" />
                        <CardContent>
                            <span className={classes.text}>Hey {this.props.keycloak.idTokenParsed.given_name} welcome on the Project overview page.<br></br>
                                Here you can find some IOT projects, or add a own one.</span>
                        </CardContent>
                    </Card>
                    {this.createList(projectList)}
                    {/* <ProjectForm keycloak={this.props.keycloak} axiosInstance={axiosInstance} /> */}
                </div>
            );
        }
    }

}

export default withStyles(useStyles)(Projects);