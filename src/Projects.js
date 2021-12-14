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

import ProjectForm from './ProjectForm';

import Divider from '@mui/material/Divider';

import DOMPurify from 'dompurify';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';



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

    quilltext: {
        '& .ql-editor': {
            backgroundColor: 'white',
        },
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
            isEdit: [],
        };

        this.deleteProject = this.deleteProject.bind(this);
    }

    deleteProject(id) {
        const { projectList } = this.state;

        this.props.keycloak.updateToken(30);

        axiosInstance.delete(stage_config.apiGateway.URL + '/project/' + projectList[id].id)
            .then(res => res.data)
            .then(
                (result) => {
                    if ("error" in result) {
                        this.setState({
                            error: { message: result.error },
                        });
                    } else {
                        projectList.splice(id, 1);
                        this.setState({
                            projectList: projectList,
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
            )
    }

    editProject(id) {
        const { isEdit } = this.state;

        isEdit[id] = true;

        this.setState({
            isEdit: isEdit,
        });
    }

    removeEditMode(id) {
        const { isEdit } = this.state;

        isEdit[id] = false;

        this.setState({
            isEdit: isEdit,
        });
    }

    componentDidMount() {
        this.getProjectList();
    }

    getProjectList() {
        this.props.keycloak.updateToken(30);
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
            )
    }

    createList() {
        const { classes } = this.props;
        const { projectList, isEdit } = this.state;
        let projectListHtml = [];



        // alert(JSON.stringify(projectList, null, "  "));

        for (let i = 0; i < projectList.length; i++) {
            console.log(projectList[i].title);

            const sanitizedText = DOMPurify.sanitize(projectList[i].text, { ALLOWED_TAGS: ['b', 'code', 'strong', 'em', 'span', 'p', 'br', 'a', 'ul', 'li'], ALLOWED_ATTR: ['style', 'href'] })

            var videoHtml = ""
            if (projectList[i].video) {
                videoHtml = <CardContent><iframe width="560" height="315" src={projectList[i].video} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <br /></CardContent>;
            }

            if (isEdit[projectList[i].id] === true) {
                projectListHtml.push(
                    <ProjectForm keycloak={this.props.keycloak} axiosInstance={axiosInstance} projectsPage={this} editId={projectList[i].id} />
                );
            } else {
                projectListHtml.push(
                    // <li key={i}>
                    <Card className={classes.site} key={i}>
                        <CardHeader title={projectList[i].title} />
                        <CardContent className={classes.breit}>
                            <ReactQuill
                                value={sanitizedText}
                                readOnly={true}
                                theme={"bubble"}
                                className={classes.quilltext}
                            />
                            {/* <span className={classes.text} dangerouslySetInnerHTML={{ __html: sanitizedText }}></span> */}
                        </CardContent>
                        {videoHtml}
                        <Divider className={classes.breit}></Divider>
                        <CardContent className={classes.breit}>
                            <span>Website: <a href={projectList[i].url}>{projectList[i].url}</a></span><br />
                            <span>Contact: {projectList[i].contact.join(', ')}</span>
                        </CardContent>
                        <CardActions className={classes.breit + ' ' + classes.parentFlexRight} >
                            <Button size="small" variant="contained" color="primary" onClick={this.editProject.bind(this, projectList[i].id)} startIcon={<EditIcon />}>Edit</Button>
                            <Button size="small" variant="contained" color="secondary" onClick={this.deleteProject.bind(this, i)} startIcon={<DeleteIcon />}>Delete</Button>
                        </CardActions>
                    </Card>
                    // </li>
                );
            }
        }
        return projectListHtml;
    }

    render() {
        const { error, isLoaded } = this.state;
        const { classes } = this.props;

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

        if (!isLoaded) {
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
                    {this.createList()}
                    <ProjectForm keycloak={this.props.keycloak} axiosInstance={axiosInstance} projectsPage={this} />
                </div>
            );
        }
    }

}

export default withStyles(useStyles)(Projects);