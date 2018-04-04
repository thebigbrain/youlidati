import * as React from 'react';
import { getSessionInfo } from '../api/http';

const styles = require('../scss/share.scss');

const shareTips = require('../assets/share-tips.png');

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
      avatar: sess.head_img_url || 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4144616231,779245726&fm=27&gp=0.jpg',
      username: sess.nick_name || '匿名',
      share_tips: shareTips
    };
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