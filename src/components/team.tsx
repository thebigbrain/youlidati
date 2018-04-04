import * as React from 'react';
import { getTeams, selectTeam } from '../api';

const styles = require('../scss/team.scss');
const teamTitle = require('../assets/select-team.png');
const layerImage = require('../assets/layers-18-copy.png');
const submitBtn = require('../assets/icon-submit.png');
const uncheckImage = require('../assets/checkbox-unchecked.png');
const checkedImage = require('../assets/Bitmap@3x.png');

let teamListCache = [];

interface TeamState {
  list: any[],
  selected: any,
}

export default class Team extends React.Component<{}, TeamState> {
  private corp_id: any;

  constructor(props) {
    super(props);

    this.state = {
      list: [],
      selected: null,
    };

    this.init();
  }

  init() {
    // setTimeout(() => {
    //   let list = [];
    //   for (var i = 0; i < 88; i++) {
    //     list.push({name: '战队名称' + i, id: Math.random()});
    //   }
    //   teamListCache = list;
    //   this.setState({list});
    // }, 500);

    getTeams().then(res => {
      if(res.data) {
        teamListCache = res.data.corps;
        this.setState({list: res.data.corps});
      }
    });
  }

  onInput(e) {
    let list = teamListCache.filter(v => {
      return v.name.match(e.target.value);
    });
    this.setState({list});
  }

  onChecked(e) {
    this.corp_id = e.id;
    this.setState({selected: e.id});
  }
  
  onSubmit(e) {
    let { history, match }: any = this.props;
    if (!this.corp_id) return window.alert('请选择战队');
    selectTeam(this.corp_id).then(() => {
      history.push(`/answer/1`);
    }).catch(err => {
      history.push(`/answer/1`);
      console.log(err);
    });
  }

  render(){
    const listItems = this.state.list.map(v => {
      return (
        <li onClick={this.onChecked.bind(this, v)} key={v.id}>
          <label onClick={this.onChecked.bind(this, v)}>
            {/* <input type='checkbox' checked={v.id == this.state.selected}/> */}
            <img src={v.id == this.state.selected ? checkedImage : uncheckImage}/>
            <span>{v.name}</span>
          </label>
        </li>
      );
    });
    return (
      <div className={styles.team}>
        {/* <h2>选择战队</h2> */}
        <img src={teamTitle}/>
        <img src={layerImage}/>
        <div className={styles.team_list}>
          <div>
            <input placeholder='请输入战队名' onInput={this.onInput.bind(this)} type='text'/>
            <ul>{listItems}</ul>
          </div>
          <div onClick={this.onSubmit.bind(this)}>
            {/* <img onClick={this.onSubmit.bind(this)} src={submitBtn}/> */}
          </div>
        </div>
      </div>
    );
  }
}