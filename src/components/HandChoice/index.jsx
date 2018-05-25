import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

const styles = {
  header: {
    backgroundColor: "#f0f0f0",
    color: "#333333",
    padding: "24px",
    marginBottom: "32px"
  },
  title: {
    fontSize: "1.5em"
  }
};

const HandChoice = ({ classes }) => (
  <hend-choice className={classes.header}>
    <div>
      <div>
        <label htmlFor="rock">
          <input id="rock" type="radio" />
        </label>
      </div>
      <div>
        <label htmlFor="scissors">
          <input id="scissors" type="radio" />
        </label>
      </div>
      <div>
        <label htmlFor="paper">
          <input id="paper" type="radio" />
        </label>
      </div>
    </div>
  </hend-choice>
);

HandChoice.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(HandChoice);
