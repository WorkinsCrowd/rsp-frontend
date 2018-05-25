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
  },
  powered: {
    "text-transform": "uppercase"
  }
};

const Header = ({ classes, title }) => (
  <header className={classes.header}>
    <div>
      <div className={classes.headerBox}>
        <h1 className={classes.title}>{title}</h1>
        <div className={classes.powered}>powered by nOS - Blockchain</div>
      </div>
      <SpinningLogo />
    </div>
  </header>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

export default injectSheet(styles)(Header);
