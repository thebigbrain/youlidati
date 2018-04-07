import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';

import { startAnswer, nextQuestion, queryResult } from '../api';
import ExaminationQuestion from './examination';
import AnswerStart from './answer_start';
import Confirm from './confirm';

const nextButton = require('../assets/next.png');
const selectCover = require('../assets/answer-select.png');
const styles = require('../scss/answer.scss');

declare var window: any;

const readyImages = [
  require('../assets/start.png'),
  require('../assets/1.png'),
  require('../assets/2.png'),
  require('../assets/3.png')
];

const testQ = {
  title: require('../assets/single-select.png'),
  content: '改革完善（）,按照三档并两档方向调整税率水平,重点降低制造业、交通运输等行业税率,提高小规模纳税人年销售额标准。',
  answers: [
    { option: 'A', detail: '营业税' },
    { option: 'B', detail: '个人所得税' },
    { option: 'C', detail: '消费税' },
    { option: 'D', detail: '增值税' },
  ],
  result: 'C'
};

interface AnswerState {
  timeLeft: number,
  started: boolean,
  ready: string,
  total: number,
  allQuestions: Array<any>,
  question: any,
  answered: number,
  selected: Array<number>,
  selectCover: string,
  result: string,
}

function resultToString(results){
  const resultStrings = ['A', 'B', 'C', 'D'];
  return results.map(v => resultStrings[v]).join('');
}

export default class Answer extends React.Component<{}, AnswerState> {
  private loopHandle: any;
  private selected: Array<number>;
  private next_clicked: boolean;
  private hasNext: boolean;

  constructor(props) {
    super(props);

    this.selected = [];
    let timeLeft: number = 15 * 60;
    this.hasNext = true;
    this.state = {
      timeLeft,
      started: false,
      ready: readyImages[3],
      total: 10,
      allQuestions: [],
      answered: -1,
      selected: [],
      selectCover: '',
      question: null,
      result: ''
    };

    // this.start();

    startAnswer().then(res => {
      let question = this.fixQuestion(res.data.question);
      this.setState({ question });
    }).catch(err => {
      window.alert(JSON.stringify(err));
    });

    let counter = 2;
    let h = setInterval(() => {
      if (counter > -1) {
        this.setState({ ready: readyImages[counter] });
        counter--;
      } else {
        clearInterval(h);
        this.setState({ started: true, ready: '' });
        this.start();
      }
    }, 1000);
  }

  fixQuestion(q) {
    let title = q.type == 1 ? require('../assets/single-select.png') : require('../assets/multi-select.png');
    let content = (q.question_content || '');
    let answers = [
      { option: 'A', detail: q.option_first },
      { option: 'B', detail: q.option_second },
      { option: 'C', detail: q.option_third },
      { option: 'D', detail: q.option_fourth },
    ];
    let question = {
      id: q.id,
      result: q.result,
      title,
      content,
      answers,
      type: q.type
    }
    return question;
  }

  start() {
    // window.correctAnsweredNumbers = 0;
    // window.answerStartedAt = Date.now();
    let t = this.state.timeLeft - 1;
    this.setState({
      timeLeft: t
    });
    this.loopHandle = setInterval(() => {
      let t = this.state.timeLeft - 1;
      this.setState({
        timeLeft: t
      });
      if (t == 0) {
        this.stop();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.loopHandle);
  }

  getTime() {
    return formatSeconds(this.state.timeLeft);
  }

  componentWillUnmount() {
    this.stop();
  }

  selectAnswer(i) {
    let q = this.state.question;
    if (q.type == 1) {
      this.selected = [i];
    } else {
      if (this.selected.includes(i)) {
        this.selected = this.selected.filter(v => v != i);
      } else {
        this.selected.push(i);
      }
    }
    if (this.selected)
    this.setState({ selected: this.selected, selectCover: '' });
    let { history, match }: any = this.props;
    this.setState({ selectCover });
  }

  next(e) {
    if (this.next_clicked) return;
    this.next_clicked = true;
    if (this.selected.length == 0) {
      const cancel = () => {
        this.next_clicked = false;
      };
      const ok = () => { this.jump2next(); };
      return window.showConfirm('直接进入下一题？', cancel, ok);
    }
    let q = this.state.question;
    queryResult(q.id, resultToString(this.selected)).then(res => {
      if (res.data && res.data.question) {
        let answered = res.data.question.is_right == 1 ? 0 : 1;
        let result = res.data.question.result;
        this.setState({ answered, result });
        setTimeout(() => {
          if (!this.hasNext) {
            let { history }: any = this.props;
            return history.replace(`/score`);
          } else {
            this.jump2next();
          }
        }, 1000);
      } else {
        window.alert(res.data);
        this.jump2next();
      }
    }).catch(err => {
      window.alert(err);
      this.jump2next();
    });
  }

  doResultQuery(result) {

  }

  jump2next(){
    this.selected = [];
    this.setState({ answered: -1, selected: [] });
    let { history, match }: any = this.props;
    let id = parseInt(match.params.id);
    id = id + 1;
    if (id > this.state.total) {
      this.next_clicked = false;
      history.replace(`/score`);
    } else {
      nextQuestion().then(res => {
        this.next_clicked = false;
        if (res.data && res.data.question) {
          let question = this.fixQuestion(res.data.question);
          this.setState({question});
          if (res.data.type == 1) {
            if (!this.hasNext) {
              history.replace(`/score`);
            }
            this.hasNext = false;
          } else {
            history.replace(`/answer/${id}`);
          }
        } else {
          // window.alert(res.code);
          this.jump2next();
        }
      }).catch(err => {
        this.next_clicked = false;
        window.alert(err);
        this.jump2next();
      });
    }
  }

  render() {
    const { match }: any = this.props;
    let id = match.params.id;
    let q = this.state.question;
    let isLoading = !q;
    // if (!q) {
    //   return(<div className={styles.loading}>正在加载...</div>);
    // };
    q = q || {};
    let props = Object.assign({
      id: match.params.id,
      total: this.state.total,
      isLoading,
      title: q.title,
      content: q.content,
      answers: q.answers,
      result: q.result,
      type: q.type
    });
    return (
      <div className={styles.answer}>
        <div className={this.state.started ? styles.answer_started : styles.answer_start}>
          <div className='mask'></div>
          <div className={styles.time_left}><span>{this.getTime()}</span></div>
          {this.state.ready ? <img src={this.state.ready} /> : ''}
        </div>
        <div className={styles.answer_detail}>
          <ExaminationQuestion {...props} />
          <div className={styles.status}>
            {this.state.answered == -1 ? '' : this.state.answered == 0 ? <div className={styles.pass}>回答正确！</div> : <div className={styles.error}>回答错误！正确答案: {this.state.result}</div>}
            <div className={styles.card}>答题卡</div>
            <i className='flex-spacer'></i>
            <ul className={styles.answer_option}>
              <li onClick={this.selectAnswer.bind(this, 0)}>
                <span>A</span>
                <img src={selectCover} className={this.state.selected.includes(0) ? styles.show : styles.hidden}/>
              </li>
              <li onClick={this.selectAnswer.bind(this, 1)}>
                <span>B</span>
                <img src={selectCover} className={this.state.selected.includes(1) ? styles.show : styles.hidden}/>
              </li>
              <li onClick={this.selectAnswer.bind(this, 2)}>
                <span>C</span>
                <img src={selectCover} className={this.state.selected.includes(2) ? styles.show : styles.hidden}/>
              </li>
              <li onClick={this.selectAnswer.bind(this, 3)}>
                <span>D</span>
                <img src={selectCover} className={this.state.selected.includes(3) ? styles.show : styles.hidden}/>
              </li>
            </ul>
            <div className={styles.next} onClick={this.next.bind(this)}>
              {/* <img onClick={this.next.bind(this)} src={nextButton} /> */}
            </div>
          </div>
        </div>
        <Confirm/>
      </div>
    );
  }
}

function paddingZero(n: number): string {
  let padding = n > 9 ? '' : '0';
  return padding + n;
}

function formatSeconds(s: number): string {
  let minute = Math.floor(s / 60);
  let second = s % 60;
  return paddingZero(minute) + ':' + paddingZero(second);
}
