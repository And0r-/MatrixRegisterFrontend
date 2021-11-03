import axios from "axios";
import stage_config from './config';

const token = window.accessToken ? window.accessToken : 'dummy_token';

export default axios.create({
  baseURL: stage_config.apiGateway.URL,
  headers: {
    "Content-type": "application/json",
    "Authorization": 'Bearer ' + token
  }
});


