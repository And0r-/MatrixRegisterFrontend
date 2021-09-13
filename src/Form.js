import React from 'react';
import { Card, TextField, Button, FormControlLabel, Switch } from '@material-ui/core';
import MuiPhoneNumber from "material-ui-phone-number";
import { withStyles } from '@material-ui/core/styles';
import stage_config from './config';
var generator = require('generate-password');

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
        '& .MuiButtonBase-root': {
            margin: theme.spacing(2),
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


class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            formState: 0,
            isLoaded: false,
            name: "",
            email: "",
            phone: "",
            post_id: "",
            checked: false,
            config: {},
            register: {},
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        fetch(stage_config.apiGateway.URL + '/config/' + this.props.match.params.token)
            .then(res => res.json())
            .then(
                (result) => {
                    if ("error" in result) {
                        this.setState({
                            formState: 1,
                            error: { message: result.error },
                        });
                    } else {
                        this.setState({
                            formState: 1,
                            config: result
                        });
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        formState: 1,
                        error
                    });
                }
            )
    }


    handleSubmit(event) {
        console.log(this.state.name, this.state.email, this.state.phone, this.props.match.params.token);
        event.preventDefault();

        this.setState({
            formState: 2
        });

        this.sendForm();
    }

    sendForm() {
        let formData = {
            name: this.state.name,
            email: this.state.email,
            phone: this.state.phone,
            post_id: this.state.post_id,
            token: this.props.match.params.token,
        };


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        };

        fetch(stage_config.apiGateway.URL + '/register', requestOptions)
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

    toggleChecked(e) {
        let post_id;
        if(e.target.checked){
            post_id = "-"+generator.generate({
                length: 6,
                numbers: true
              });
        } else {
            post_id = ""
        };

		this.setState({
			checked: e.target.checked,
            post_id: post_id
		})
    }

    render() {
        const { error, formState, config } = this.state;
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
            const { name, email, phone, post_id, checked } = this.state;
            return (
                <div className={classes.container} >
                    <Card className={classes.site}>{config.registrationText}<br /></Card>
                    <form className={classes.site} onSubmit={this.handleSubmit}>
                        <TextField
                            label={config.nameLabel}
                            variant="filled"
                            required
                            value={name}
                            onChange={e => this.setState({ name: e.target.value })}
                        />
                        <TextField
                            label={config.emailLabel}
                            variant="filled"
                            type="email"
                            name="email"
                            required
                            value={email}
                            onChange={e => this.setState({ email: e.target.value })}
                        />
                        <MuiPhoneNumber
                            name="tel"
                            label={config.telLabel}
                            variant="filled"
                            data-cy="user-phone"
                            defaultCountry={config.country}
                            value={phone}
                            onChange={e => this.setState({ phone: e })}
                        />
                        <FormControlLabel
                            control={<Switch checked={checked} onChange={(e) => this.toggleChecked(e)} />}
                            label="paranoid security"
                            className="switch"
                        />
                        {checked == true &&
                        <TextField
                            label="Zufällige zeichen"
                            variant="filled"
                            name="post_id"
                            value={post_id}
                            helperText='"Wenn ein Hacker deine ID errät, kann er den Anzeigenamen und Provielbild abruffen. Zufällige Zeichen an die ID anhängen?'
                            onChange={e => this.setState({ post_id: e.target.value })}
                        />
                        }
                        <div>
                            <Button type="submit" variant="contained" color="primary">
                                {config.submitLabel}
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
                <Card className={classes.site} dangerouslySetInnerHTML={{ __html: config.doneText }} />
            </div>;
        }
    }
};

export default withStyles(useStyles)(Form);