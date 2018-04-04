import React = require('react');
import { Route, Switch } from 'react-router-dom';
import { getSessionInfo } from '../api/http';

const styles = require('../scss/app.scss');

import Boot from './boot';
import Answer from './answer';
import Team from './team';
import Score from './score';
import Share from './share';
import TeamRanking from './team_ranking';

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.app}>
        <Route exact path='/' component={Boot}></Route>
        <Route path='/team' component={Team}></Route>
        <Route path='/answer/:id' component={Answer}></Route>
        <Route path='/score' component={Score}/>
        <Route path='/share' component={Share}/>
        <Route path = '/ranking/team' component={TeamRanking}></Route>
      </div>
    );
  }
}