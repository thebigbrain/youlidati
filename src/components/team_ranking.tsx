import * as React from 'react';
import { getSessionInfo } from '../api/http';
import { getTeamRankings } from '../api';

const styles = require('../scss/team_ranking.scss');

const againImage = require('../assets/again.png');
const shareImage = require('../assets/share.png');

interface TeamRankingState {
  list: Array<any>,
}

export default class TeamRanking extends React.Component<{}, TeamRankingState> {
  private sess: any;

  constructor(props){
    super(props);

    this.sess = getSessionInfo();

    this.state = {
      list: []
    };
    getTeamRankings().then(res => {
      let list = res.data.corps;
      this.setState({list});
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

  render() {
    const listItems = this.state.list.map((t) =>
      <li className={this.sess.corp_id == t.id ? styles.selected : ''}><span>{t.sort}</span><span>{t.name}</span><span>{t.score}</span></li>
    );
    return (
      <div className={styles.top_team}>
        <h2>战队排行榜</h2>
        <ul>{listItems}</ul>
        <div className={styles.ops}>
          <div onClick={this.tryAgain.bind(this)}>
          </div>
          <img onClick={this.toShare.bind(this)} src={shareImage} />
        </div>
      </div>
    );
  }
}