import * as React from 'react';

const styles = require('../scss/examination');

interface ExaminationProps {
  id: number,
  total: number,
  title: string,
  content: string,
  answers: Array<any>,
  isLoading: boolean,
}

export default class Examination extends React.Component<ExaminationProps> {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.isLoading) return (<div className={styles.examination}><div className={styles.loading}>正在加载...</div></div>);
    const listItems = (this.props.answers || []).map(({option, detail}) =>
      <li key={option}>{detail}</li>
    );
    let { type }: any = this.props;
    return (
      <div className={styles.examination}>
        <img className={styles.title} src={this.props.title}/>
        <span>{this.props.id}/{this.props.total}</span>
        <p className={styles.content}>{this.props.content}<span>{`(${type == 1 ? '单选' : '多选'})`}</span></p>
        <ul className={styles.answers}>{listItems}</ul>
      </div>
    );
  }
}