const config = {
    dev: {
        apiGateway: {
            URL: "https://tools.iot-schweiz.ch/api"
        }
    },

    prod: {
        apiGateway: {
            URL: "https://tools.iot-schweiz.ch/api"
        }
    },

    local: {
        apiGateway: {
            URL: "http://localhost:3001"
        }
    }
};


const selected_config = config[localStorage.getItem('stage')] || config[process.env.REACT_APP_STAGE] || config.prod;


const final_config = {
    // Add common config values here
    // MAX_ATTACHMENT_SIZE: 5000000,
    ...selected_config
};

export default final_config;