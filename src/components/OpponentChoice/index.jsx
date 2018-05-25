import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { nosPropTypes } from "@nosplatform/api-functions/es6";

import { injectNOS } from "../../nos";

const styles = {
  choices: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "center"
  },
  input: {
    width: "400px",
    height: "20px",
    padding: "10px",
    border: "none",
    outline: "none",
    backgroundColor: "rgb(243,243,243)",
    color: "black",
    margin: "5px",
    "::placeholder": {
      color: "rgb(203,203,203)"
    }
  },
  button: {
    position: "absolute",
    right: "10px",
    top: "10px",
    height: "30px",
    width: "60px"
  },
  inputBox: {
    position: "relative"
  }
};

class OpponentChoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerAddress: "",
      opponent: "",
      opponentButtonText: "confirm",
      opponentEnabled: true
    };
  }
  componentDidMount = async () => {
    await this.setState({ playerAddress: await this.props.nos.getAddress() });
  };

  opponentChangeHandler = async event => {
    await this.setState({ opponent: event.target.value });
  };

  confirmOpponentHandler = async () => {
    if (this.state.opponentButtonText === "confirm") {
      await this.setState({
        opponentButtonText: "change",
        opponentEnabled: false
      });
    } else {
      await this.setState({
        opponentButtonText: "confirm",
        opponentEnabled: true
      });
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.choices}>
          <div className={classes.inputBox}>
            <input
              className={classes.input}
              type="text"
              placeholder="Your address"
              value={this.state.playerAddress}
              disabled
            />
          </div>
          <div className={classes.inputBox}>
            <input
              className={classes.input}
              type="text"
              placeholder="Opponent address"
              value={this.state.opponent}
              onChange={this.opponentChangeHandler}
              disabled={!this.state.opponentEnabled}
            />
            <button className={classes.button} onClick={this.confirmOpponentHandler}>
              {this.state.opponentButtonText}
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

OpponentChoice.propTypes = {
  classes: PropTypes.object.isRequired,
  nos: nosPropTypes.isRequired
};

OpponentChoice.defaultProps = {};

export default injectNOS(injectSheet(styles)(OpponentChoice));
