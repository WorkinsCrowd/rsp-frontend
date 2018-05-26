import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

import SpinningLogo from "./../SpinningLogo";

const styles = {
  title: {
    "text-transform": "capitalize",
    "font-size": "3em"
  },
  header: {
    padding: "24px",
    marginBottom: "32px"
  },
  headerBox: {
    "text-align": "center"
  }
};

const Header = ({ classes }) => (
  <header className={classes.header}>
    <div>
      <SpinningLogo />
    </div>
  </header>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

export default injectSheet(styles)(Header);
