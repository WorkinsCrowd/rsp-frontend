import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

const styles = {
  actionBox: {
    display: "flex",
    "justify-content": "center"
  },
  button: {
    border: "none",
    width: "100px",
    height: "25px"
  }
};

const ActionHands = ({ classes }) => (
  <hend-choice>
    <div>
      <div className={classes.actionBox}>
        <img alt="Your hand" />
        <button className={classes.button}>GO</button>
        <img alt="Opponents hand" />
      </div>
    </div>
  </hend-choice>
);

ActionHands.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(ActionHands);
