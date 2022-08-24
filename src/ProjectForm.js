import React from 'react';
import { Box, Card, TextField, Button, CardContent } from '@mui/material';
import { withStyles } from '@mui/styles';
// import { createTheme, ThemeProvider } from '@mui/material/styles'
import stage_config from './config';

import DeleteIcon from '@mui/icons-material/Delete';

import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';

// import MUIRichTextEditor from 'mui-rte'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

import Expire from './Expire';

import UploadFiles from "./components/upload-files.component";




const useStyles = {
    site: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',

        '& .MuiTextField-root': {
            margin: '8px',
            width: '600px',
        },

        '& .MuiSwitch-root .MuiButtonBase-root': {
            margin: '0px',
        },
        '& .switch': {
            width: '600px',
        },
        '& .ql-container': {
            fontSize: 18
        },
    },

    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    half: {
        width: '300px',
    },

    breit: {
        width: '568px',
    },

    parentFlexRight: {
        display: "flex",
        justifyContent: "flex-end"
    },

    root: {
        height: '100%',
    },


};


// const defaultTheme = createTheme()

// Object.assign(defaultTheme, {
//     overrides: {
//         MUIRichTextEditor: {
//             root: {
//                 marginTop: 20,
//                 width: "568px",
//                 margin: '8px',
//                 padding: '16px',
//             },
//             editor: {
//                 borderBottom: "1px solid gray",
//                 background: "lightgray"
//             }
//         }
//     }
// })


// var toolbarOptions = ['bold', 'italic', 'underline', 'strike'];
var toolbarOptions = ['bold', 'italic', 'link', 'clean', { 'color': [] }];


class ProjectForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            formState: 1,
            isLoaded: false,
            title: "",
            text: "",
            url: "",
            video: "",
            contact: []
        };


        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (this.props.editId !== undefined) {
            this.getProjectList();
        }
    }

    getProjectList() {
        this.props.keycloak.updateToken(30);
        this.props.axiosInstance.get(stage_config.apiGateway.URL + '/project/' + this.props.editId)
            .then(res => res.data)
            .then(
                (result) => {
                    if ("error" in result) {
                        this.setState({
                            error: { message: result.error },
                        });
                    } else {
                        console.log("edit mode loaded for ", this.props.editId, " found title: ", result.title);
                        this.setState({
                            title: result.title,
                            text: result.text,
                            url: result.url,
                            video: result.video,
                            creator: result.creator,
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

    handleChange(value) {
        this.setState({ text: value })
    }

    handleSubmit(event) {
        // console.log(this.state.name, this.state.email, this.state.phone, this.props.match.params.token, this.state.twofa);
        event.preventDefault();

        this.setState({
            formState: 2
        });

        if (this.props.editId === undefined) {
            this.sendCreateForm();
        } else {
            this.sendUpdateForm();
        }
    }

    sendUpdateForm() {
        let formData = {
            title: this.state.title,
            text: this.state.text,
            url: this.state.url,
            video: this.state.video,
            creator: this.state.creator
        };

        if (this.state.contact && this.state.contact.length > 0) {
            formData.contact = this.state.contact
        }

        this.props.keycloak.updateToken(30);

        this.props.axiosInstance.put(stage_config.apiGateway.URL + '/project/'+this.props.editId, JSON.stringify(formData), {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.data)
            .then(
                (result) => {
                    this.props.projectsPage.removeEditMode(this.props.editId);
                    this.props.projectsPage.getProjectList();

                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        formState: 3,
                        error
                    });
                }
            )
    }


    sendCreateForm() {
        let formData = {
            title: this.state.title,
            text: this.state.text,
            url: this.state.url,
            video: this.state.video,
            creator: this.props.keycloak.idTokenParsed.sub
        };

        if (this.state.contact && this.state.contact.length > 0) {
            formData.contact = this.state.contact
        }

        this.props.keycloak.updateToken(30);

        this.props.axiosInstance.post(stage_config.apiGateway.URL + '/test2', JSON.stringify(formData), {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.data)
            .then(
                (result) => {
                    this.setState({
                        formState: 1,
                        register: result,
                        title: "",
                        text: "",
                        url: "",
                        video: "",
                        notification: "Projekt added :D"
                    });
                    this.props.projectsPage.getProjectList();

                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        formState: 3,
                        error
                    });
                }
            )
    }

    render() {
        const { error, formState } = this.state;
        const { classes } = this.props;


        if (error) {
            return <div className={classes.container} >
                <Card className={classes.site}>Error: {error.message}</Card>
            </div>;

        } if (formState === 0) {
            return <div className={classes.container} >
                <Card className={classes.site}>Loading...</Card>
            </div>;

        } if (formState === 1) {
            const { title, text, url, video, notification } = this.state;
            let notificationHtml = "";

            if (notification) {
                notificationHtml = <Expire delay="5000">
                    <Card className={classes.site} style={{ width: 600 }}>Test Message</Card>
                </Expire>

            }


            return (
                <div className={classes.container} key={"form_" + this.props.editId} >

                    <Box
                        component="form"
                        onSubmit={this.handleSubmit}
                        className={classes.site}
                    >
                        <Card className={classes.site} style={{ width: 600 }}>

                            <CardHeader title={(this.props.editId === undefined) ? 'Add a Project' : 'Edit Project'} />
                            <CardContent>
                            <span className={classes.text}>
                                Some browsers still have bugs with adding, editing, or removing projects.<br />
                                If it doesn't work, send the relevant data to Nemolus and it will be added soon.
                            </span>
                            </CardContent>
                            <TextField
                                label="Title"
                                variant="filled"
                                name="title"
                                required
                                value={title}
                                onChange={e => this.setState({ title: e.target.value })}
                                style={{ width: 568 }}
                            />
                            <ReactQuill
                                theme="bubble"
                                value={text}
                                placeholder="Text"
                                onChange={this.handleChange}
                                style={{ width: 568 }}
                                format={toolbarOptions}
                                modules={{
                                    toolbar: toolbarOptions
                                }}

                            />
                            <div>
                                {/* <TextField
                                    label="Yourube Link"
                                    variant="filled"
                                    name="video"
                                    value={video}
                                    onChange={e => this.setState({ video: e.target.value })}
                                    style={{ width: 276 }}
                                /> */}
                                <TextField
                                    label="Link"
                                    variant="filled"
                                    name="url"
                                    value={url}
                                    onChange={e => this.setState({ url: e.target.value })}
                                    // style={{ width: 276 }}
                                    style={{ width: 568 }}
                                />
                            </div>

                            {/* <UploadFiles /> */}

                            <CardActions className={classes.breit + ' ' + classes.parentFlexRight} >

                                <Button type="submit" size="small" variant="contained" color="primary" startIcon={<DeleteIcon />}>{(this.props.editId === undefined) ? 'create' : 'update'}</Button>
                            </CardActions>
                        </Card>
                    </Box>
                    {notificationHtml}

                </div>
            );

        } if (formState === 2) {
            return <div className={classes.container} >
                <Card className={classes.site}>Sending Data...</Card>
            </div>;

        } if (formState === 3) {
            // this.props.projectsPage.getProjectList();
            return <div className={classes.container} >
                <Card className={classes.site} >Project added :D</Card>
            </div>;

        }
    }
};

export default withStyles(useStyles)(ProjectForm);