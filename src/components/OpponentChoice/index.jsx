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
    color: "rgb(203,203,203)",
    margin: "5px"
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
