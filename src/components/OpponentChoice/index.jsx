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
    width: "350px",
    height: "20px",
    padding: "5px",
    border: "none"
  },
  button: {
    position: "absolute",
    right: "5px",
    top: "5px",
    height: "20px",
    width: "55px",
    "z-index": "2",
    border: "none"
  },
  inputBox: {
    position: "relative"
  }
};

const OpponentChoice = ({ classes }) => (
  <opponnet-choice>
    <div className={classes.choices}>
      <div className={classes.inputBox}>
        <input className={classes.input} type="text" placeholder="Your address" />
        <button className={classes.button}>confirm</button>
      </div>
      <div className={classes.inputBox}>
        <input className={classes.input} type="text" placeholder="Opponent address" />
        <button className={classes.button}>confirm</button>
      </div>
    </div>
  </opponnet-choice>
);

OpponentChoice.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(OpponentChoice);
