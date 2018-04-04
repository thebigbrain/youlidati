import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import { getSessionInfo } from '../api/http';

import Answer from './answer';

const styles = require('../scss/boot.scss');
const startButton = require('../assets/start_answer.png');

export default class Boot extends React.Component {
  render() {
    let sess = getSessionInfo();
    let path = sess.corp_id ? '/answer/1' : '/team';
    // let path = '/team';
    return (
      <div className={styles.boot}>
        <Link to={path} className={styles.start}>
          {/* <img src={startButton}/> */}
        </Link>
      </div>
    );
  }
}
