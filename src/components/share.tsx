import * as React from 'react';
import { getSessionInfo } from '../api/http';
import { wxconfig } from '../api';

declare var window: any;

const styles = require('../scss/share.scss');

const shareTips = require('../assets/share-tips.png');
const shareImgUrl = require('../assets/youlidati_share.jpg');

interface ShareState {
  avatar: string,
  username: string,
  share_tips: string,
}

export default class Share extends React.Component<{}, ShareState> {
  constructor(props){
    super(props);

    let sess = getSessionInfo();

    this.state = {
      avatar: sess.head_img_url,
      username: sess.nick_name || '匿名',
      share_tips: shareTips
    };

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
          this.init_share();
        });
      });
    }
  }

  init_share() {
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

  render() {
    return (
      <div className={styles.share}>
        <img className='share-tips' src={this.state.share_tips}/>
        <img className={styles.avatar} src={this.state.avatar}/>
        <span className='username'>{this.state.username}</span>
        <p className='praise'>集美貌与才华于一身的你!!</p>
        <div className='qrcode'></div>
        <p>长按识别二维码</p>
      </div>
    );
  }
}