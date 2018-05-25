import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

const styles = {

};

const OpponentChoice = ({ classes }) => (
  <hend-choice className={classes.header}>
    <div>
      <div>
        <input type="text" placeholder="your address" />
        <button />
      </div>
      <div>
        <input type="text" placeholder="opponent address" />
        <button />
      </div>
    </div>
  </hend-choice>
);

OpponentChoice.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(OpponentChoice);
