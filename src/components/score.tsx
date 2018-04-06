import * as React from 'react';
import { nextQuestion } from '../api';
import { getSessionInfo } from '../api/http';

const styles = require('../scss/score.scss');
const layerImage = require('../assets/layers-18-copy.png');
const marksImage = require('../assets/marks.png');
const marksBg = require('../assets/light.png');
const marksGreyImage = require('../assets/marks-grey.png');
const againImage = require('../assets/again.png');
const shareImage = require('../assets/share.png');

let teamListCache = [];

const gloryScoreNumber = 60;

interface ScoreState {
  score: number,
  elapsed: string,
  rank: number,
  total: number,
  team: string,
}

function paddingZero(n) {
  return '' + (n > 9 ? n : '0' + (n > 0 ? n : '0'));
}

function convertTime(t:number) {
  let mili = Math.floor(t/1000);
  let m = paddingZero(Math.floor(mili / 60));
  let s = paddingZero(mili % 60);
  return m + "'" + s + "''";
}

export default class Score extends React.Component<{}, ScoreState> {
  constructor(props) {
    super(props);

    let sess = getSessionInfo();
    this.state = {
      score: 0,
      elapsed: '00分00秒',
      rank: 999,
      total: 999,
      team: sess.corp_name || 'xx大学'
    }

    nextQuestion().then(res => {
      let result = res.data.result || {};
      this.setState({
        score: result.score,
        elapsed: convertTime(parseInt(result.cost_time)),
        rank: result.sort,
        total: result.team_num,
        team: sess.corp_name
      });
    });
  }

  tryAgain(){
    let { history }: any = this.props;
    history.replace(`/answer/1`);
  }

  toShare(){
    let { history }: any = this.props;
    history.push(`/share`);
  }

  glory(){
    return (
      <div className='glory-info'>
      {
        this.state.score >= gloryScoreNumber 
        ? 
        <div className='glory-info'>
          <p>共有<i>{this.state.total}</i>位队友</p>
          <p>点亮了{this.state.team}的马克思头像</p>
        </div>
        : 
        <div className='glory-info'>
          <p>这暗淡的成绩</p>
          <p>马爷爷的头像都灰了</p>
        </div>
      }
      </div>
    );
  }

  viewTeamRanking(){
    let { history }: any = this.props;
    history.push(`/ranking/team`);
  }

  render() {
    return (
      <div className={styles.score}>
        <img src={layerImage} />
        <div className={styles.score_number}><span>{this.state.score}</span><span>分</span></div>
        <div className={styles.time_used}>
          <span>用时：{this.state.elapsed}</span>
          <span>排名：{this.state.rank}名</span>
        </div>
        {/* <img src={layerImage} /> */}
        <div className={styles.marks}>
          {this.state.score >= gloryScoreNumber ? <img className={styles.marks_bg} src={marksBg}/> : '' }
          <img src={ this.state.score >= gloryScoreNumber ? marksImage : marksGreyImage}/>
        </div>
        {this.glory()}
        <i className='flex-spacer'></i>
        <div className={styles.ops}>
          <div onClick={this.viewTeamRanking.bind(this)}>
            {/* <img  src={againImage} /> */}
          </div>
          <img onClick={this.toShare.bind(this)} src={shareImage} />
        </div>
        {/* <div className={styles.team_ranking}>
          <a onClick={this.viewTeamRanking.bind(this)}>查看战队排行</a>
        </div> */}
      </div>
    );
  }
}