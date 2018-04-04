import _axios from 'axios'
import * as qs from 'qs'
import * as uuidv4 from 'uuid/v4';
const sha256: any = require('js-sha256');

const SALT: string = 'YH?36Z&4>9k';

let token = JSON.parse(window.localStorage.getItem('sessionInfo'));

function getHeaders() {
  let reqId = uuidv4(), timestamp = Date.now();
  const signature = sha256(`${reqId}&&${timestamp}&&${SALT}`);
  // if (!token || !token.id) token = JSON.parse(window.localStorage.getItem('sessionInfo'));
  token = JSON.parse(window.localStorage.getItem('sessionInfo'));
  let t = token || {};
  return {
    'X-SESSION-ID': t.id || '',
    'X-REQUEST-ID': reqId,
    'X-TIMESTAMP': timestamp,
    'X-SIGNATURE': signature
  };
}

export function getSessionInfo() {
  return token || JSON.parse(window.localStorage.getItem('sessionInfo')) || {};
}

export const axios = _axios;
export const noop = () => { };

export const handleRespWithoutAlert = (res) => {
  if (res.code === 1000) {
    return res.data
  }
};

// export const baseURL = 'http://xxyltest.zbfuhua.com';
export const baseURL = 'http://xxyl.zbfuhua.com';
// axios.defaults.baseURL = baseURL;

const throwErr = (err) => {
  console.log(err);
  throw err;
};

function request(config: any = {}) {
  let url = config.url;
  if (url[0] === '/' && url[1] === '?') url = url.substring(1);
  config.url = baseURL + url;
  config.withCredentials = false;
  config.headers = config.headers || {};
  config.headers = Object.assign({}, config.headers, getHeaders());
  return axios.request(config);
}

const get = (url, params?) => {
  return request({ url, method: 'GET', params }).then(res => res.data).catch(throwErr);
};

const post = (url, data = {}, options: any = {}) => {
  options.headers = Object.assign({
    'content-type': 'application/x-www-form-urlencoded'
  }, options.headers);
  return request({ url, method: 'POST', data: qs.stringify(data), options }).then(res => res.data).catch(throwErr);
};

const uploadFile = (url, data) => {
  let headers = {
    'content-type': 'application/x-www-form-urlencoded'
  };

  return request({ url, method: 'post', data, headers }).then(res => res.data).catch(throwErr);
};

const http = {
  get,
  post,
  uploadFile
};

export default http;
