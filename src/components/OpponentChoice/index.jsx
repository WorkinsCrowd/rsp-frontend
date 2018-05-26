import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

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
  disabled: {
    backgroundColor: "white"
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
      opponent: "",
      opponentButtonText: "confirm",
      opponentEnabled: true
    };
  }

  componentDidMount = async () => {
    if (this.props.opponent !== "") {
      await this.setState({
        opponentButtonText: "change",
        opponentEnabled: false,
        opponent: this.props.opponent
      });
    }
  };

  changeOpponentHandler = async event => {
    await this.setState({
      opponent: event.target.value
    });
  };

  setOpponent = async () => {
    if (this.state.opponentButtonText === "confirm") {
      await this.props.chooseOpponent(this.state.opponent);

      await this.setState({
        opponentButtonText: "change",
        opponentEnabled: false
      });
    } else {
      await this.props.chooseOpponent("");

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
              className={`${classes.input} ${classes.disabled}`}
              type="text"
              placeholder="Your address"
              value={this.props.playerAddress}
              disabled
            />
          </div>
          <div className={classes.inputBox}>
            <input
              className={`${classes.input} ${this.state.opponentEnabled ? "" : classes.disabled}`}
              type="text"
              placeholder="Opponent address"
              value={this.state.opponent}
              onChange={this.changeOpponentHandler}
              disabled={!this.state.opponentEnabled}
            />
            <button className={classes.button} onClick={this.setOpponent}>
              {this.state.opponentButtonText}
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

OpponentChoice.propTypes = {
  playerAddress: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  opponent: PropTypes.string.isRequired,
  chooseOpponent: PropTypes.func.isRequired
};

OpponentChoice.defaultProps = {};

export default injectSheet(styles)(OpponentChoice);
