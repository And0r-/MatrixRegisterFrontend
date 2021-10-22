import React from 'react';
import { Card, TextField, Button, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import stage_config from './config';

const useStyles = theme => ({
    site: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2),

        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '300px',
        },

        '& .MuiSwitch-root .MuiButtonBase-root': {
            margin: theme.spacing(0),
        },
        '& .switch': {
            width: '300px',
        }
    },

    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    root: {
        height: '100%',
    },
});


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
    }

    handleSubmit(event) {
        // console.log(this.state.name, this.state.email, this.state.phone, this.props.match.params.token, this.state.twofa);
        event.preventDefault();

        this.setState({
            formState: 2
        });

        this.sendForm();
    }

    sendForm() {
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

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        };

        console.log(formData);

        fetch(stage_config.apiGateway.URL + '/test2', requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        formState: 3,
                        register: result
                    });
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

        } if (formState == 0) {
            return <div className={classes.container} >
                <Card className={classes.site}>Loading...</Card>
            </div>;

        } if (formState == 1) {
            const { title, text, url, video, contact } = this.state;
            return (
                <div className={classes.container} >
                    <Card className={classes.site}>Add a Project<br /></Card>
                    <form className={classes.site} onSubmit={this.handleSubmit}>
                        <TextField
                            label="Title"
                            variant="filled"
                            name="title"
                            required
                            value={title}
                            onChange={e => this.setState({ title: e.target.value })}
                        />
                        <TextField
                            label="Text"
                            variant="filled"
                            name="text"
                            required
                            value={text}
                            onChange={e => this.setState({ text: e.target.value })}
                        />
                        <TextField
                            label="Link"
                            variant="filled"
                            name="url"
                            value={url}
                            onChange={e => this.setState({ url: e.target.value })}
                        />
                        <TextField
                            label="Yourube Link"
                            variant="filled"
                            name="video"
                            value={video}
                            onChange={e => this.setState({ video: e.target.value })}
                        />
                        


                        <div>
                            <Button type="submit" variant="contained" color="primary">
                                Erstellen
                            </Button>
                        </div>
                    </form>
                </div>
            );

        } if (formState == 2) {
            return <div className={classes.container} >
                <Card className={classes.site}>Sendig Data...</Card>
            </div>;

        } if (formState == 3) {
            return <div className={classes.container} >
                <Card className={classes.site} >Project added :D</Card>
            </div>;
        }
    }
};

export default withStyles(useStyles)(ProjectForm);