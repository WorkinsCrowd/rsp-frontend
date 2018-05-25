import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

const styles = {};

const ActionHands = ({ classes }) => (
  <hend-choice className={classes.header}>
    <div>
      <div>
        <img alt="alt" />
        <button />
        <img alt="alt" />
      </div>
    </div>
  </hend-choice>
);

ActionHands.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(ActionHands);
