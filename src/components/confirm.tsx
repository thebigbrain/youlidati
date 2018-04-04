import * as React from 'react';

const styles = require('../scss/confirm.scss');
const backToAnswer = require('../assets/back-to-answer.png');
const nextImage = require('../assets/next-white.png');

declare var window: any;

interface ConfirmState {
  show: boolean,
  message: string,
}

export default class Confirm extends React.Component<{}, ConfirmState> {
  private cancelCallback: any;
  private okCallback: any;

  constructor(props) {
    super(props);

    this.state = {
      show: false,
      message: ''
    }

    window.showConfirm = (message, cancel?, ok?) => {
      this.setState({show: true, message});
      if (typeof cancel == 'function') {
        this.cancelCallback = cancel;
      }
      if (typeof ok == 'function') {
        this.okCallback = ok;
      }
    };

    window.hideConfirm = () => {
      this.setState({show: false});
    };
  }

  cancel(){
    if (this.cancelCallback) this.cancelCallback();
    window.hideConfirm();
  }

  ok(){
    if (this.okCallback) this.okCallback();
    window.hideConfirm();
  }

  render() {
    return (
      <div className={this.state.show ? styles.confirm : styles.hidden}>
        <div className={styles.mask}></div>
        <div className={styles.popup_body}>
          <p>{this.state.message}</p>
          <div>
            <img onClick={this.cancel.bind(this)} src={backToAnswer}/>
            <img onClick={this.ok.bind(this)} src={nextImage}/>
          </div>
        </div>
      </div>
    );
  }
}