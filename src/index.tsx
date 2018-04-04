import React = require('react');
import ReatDOM = require('react-dom');
import { HashRouter as Router } from 'react-router-dom';

import App from './components/app';

import { login } from './api';

// ReatDOM.render((
//   <Router>
//     <App/>
//   </Router>
// ), document.getElementById('app'));

let code = window.location.search.split('?')[1].split('=')[1].split('&')[0];
login({code}).then((res) => {
  if (res.data) {
    let cs = res.data.client_session;
    window.localStorage.setItem('sessionInfo', JSON.stringify(cs));
    ReatDOM.render((
      <Router>
        <App/>
      </Router>
    ), document.getElementById('app'));
  } else {
    // window.alert(res.code);
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfd37b894bded6bf8&redirect_uri=http%3A%2F%2Fxxyl.zbfuhua.com%2F&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect';
  }
}).catch(err => {
  window.alert(JSON.stringify(err || '登录失败'));
});
