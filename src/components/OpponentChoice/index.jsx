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
  changeOpponentHandler = async event => {
    await this.setState({
      opponent: event.target.value
    });

    await this.props.chooseOpponent(this.state.opponent);
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
              className={`${classes.input} ${this.props.changeOpponentEnabled ? "" : classes.disabled}`}
              type="text"
              placeholder="Opponent's NEO address"
              value={this.props.opponent}
              onChange={this.changeOpponentHandler}
              disabled={!this.props.changeOpponentEnabled}
            />
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
  chooseOpponent: PropTypes.func.isRequired,
  changeOpponentEnabled: PropTypes.bool.isRequired
};

OpponentChoice.defaultProps = {};

export default injectSheet(styles)(OpponentChoice);
