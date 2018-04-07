import React = require('react');
import ReatDOM = require('react-dom');
import { HashRouter as Router } from 'react-router-dom';

import App from './components/app';

import { login, wxconfig } from './api';

declare var window: any;

const shareImgUrl = require('./assets/youlidati_share.jpg');

function reload() {
  window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfd37b894bded6bf8&redirect_uri=http%3A%2F%2Fxxyl.zbfuhua.com%2F&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect';
}

let code = '';
try {
  code = window.location.search.split('?')[1].split('=')[1].split('&')[0];
} catch(err) {
  console.log(err);
  reload();
};

login({code}).then((res) => {
  if (res.data) {
    let cs = res.data.client_session;
    window.localStorage.setItem('sessionInfo', JSON.stringify(cs));
    ReatDOM.render((
      <Router>
        <App/>
      </Router>
    ), document.getElementById('app'));
    wxConfig();
  } else {
    // window.alert(res.code);
    reload();
  }
}).catch(err => {
  window.alert(JSON.stringify(err || '登录失败'));
});

function wxConfig() {
  wxconfig().then((res) => {
    window.wx.config(Object.assign({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: '', // 必填，公众号的唯一标识
      timestamp: '', // 必填，生成签名的时间戳
      nonceStr: '', // 必填，生成签名的随机串
      signature: '',// 必填，签名
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表
    }, res.data.sign, {
      nonceStr: res.data.sign.noncestr
    }));
    window.wx.ready(() => {
      init_share();
    });
  });
}

function init_share() {
  let config = {
    title: '纪念马克思诞辰200周年，测测你对他的了解有几分！', // 分享标题
    desc: '信仰的味道有点甜', // 分享描述
    link: 'http://xxyl.zbfuhua.com/share', // 分享链接
    imgUrl: window.location.origin + '/' + shareImgUrl, // 分享图标
    success: function () {
    // 用户确认分享后执行的回调函数
    console.log('分享成功')
    },
    cancel: function () {
    // 用户取消分享后执行的回调函数
    console.log('分享取消')
    }
  };
  window.wx.onMenuShareTimeline(config);
  window.wx.onMenuShareAppMessage(config);
  window.wx.onMenuShareQQ(config);
}
