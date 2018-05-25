import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

import nosLogo from "./../../assets/logo.png";

const styles = {
  logoContainer: {
    display: "block",
    maxWidth: "100px",
    margin: "32px auto",
    position: "absolute",
    top: "0",
    right: "5%"
  },
  nosLogo: {
    animation: "nOS-logo-spin infinite 3s linear",
    width: "100%"
  },
  "@keyframes nOS-logo-spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" }
  }
};

const SpinningLogo = ({ classes }) => (
  <div className={classes.logoContainer}>
    <img src={nosLogo} className={classes.nosLogo} alt="nOS logo" key="nosLogo" />
  </div>
);

SpinningLogo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(SpinningLogo);
