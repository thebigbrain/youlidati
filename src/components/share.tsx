import * as React from 'react';
import { getSessionInfo } from '../api/http';

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

    this.init_share();
  }

  init_share() {
    let config = {
      title: '有理答题', // 分享标题
      desc: '1、纪念马克思诞辰200周年，测测你对他的了解有几分！2、信仰的味道有点甜', // 分享描述
      link: 'http://xxyl.zbfuhua.com/share', // 分享链接
      imgUrl: shareImgUrl, // 分享图标
      success: function () {
      // 用户确认分享后执行的回调函数
      },
      cancel: function () {
      // 用户取消分享后执行的回调函数
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