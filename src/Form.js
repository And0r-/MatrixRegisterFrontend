import React from 'react';
import { Card, TextField, Button, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio } from '@material-ui/core';
import MuiPhoneNumber from "material-ui-phone-number";
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
            config: {},
            register: {},
            twofa: "email"
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
        console.log(this.state.name, this.state.email, this.state.phone, this.props.match.params.token, this.state.twofa);
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
            twofa: this.state.twofa,
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
            const { name, email, phone } = this.state;
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

                        <br />&nbsp;<br />

                        <FormControl component="fieldset">
                            <FormLabel component="legend">Two Factor Auth</FormLabel>
                            <RadioGroup
                                aria-label="gender"
                                defaultValue="email"
                                name="radio-buttons-group"
                                onChange={e => this.setState({ twofa: e.target.value })}
                            >
                                <FormControlLabel value="email" control={<Radio />} label="Email" />
                                <FormControlLabel value="authenticator" control={<Radio />} label="Authenticator" />
                            </RadioGroup>
                        </FormControl>

                        <br />&nbsp;<br />

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