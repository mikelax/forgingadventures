import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Message, TransitionablePortal } from 'semantic-ui-react';

export default class SuccessToast extends Component {

  static propTypes = {
    open: PropTypes.bool,
    text: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      open: props.open || true
    };
  }

  componentWillReceiveProps(nextProps) {
    const { open } = nextProps;

    this.setState({ open });
  }

  render() {
    const { open } = this.state;
    const { text } = this.props;

    return (
      <TransitionablePortal open={open} onOpen={this._autoDismiss} transition={{ animation: 'fade', duration: 500 }}>
        <Message positive style={{ left: '40%', position: 'fixed', top: '10%', zIndex: 1000 }}>
          <p>{text}</p>
        </Message>
      </TransitionablePortal>
    );
  };

  _autoDismiss = () => {
    setTimeout(() => {
      this.setState({ open: false });
    }, 2500);
  };
}