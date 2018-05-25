import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

import SpinningLogo from "./../SpinningLogo";

const styles = {


};

const Header = ({ classes, title }) => (
  <header className={classes.header}>
    <div>
      <div>
        <h1 className={classes.title}>{title}</h1>
        <div>powered by nOS - Blockchain</div>
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
