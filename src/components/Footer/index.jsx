import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

const styles = {
  footer: {
    display: "flex",
    justifyContent: "center"
  },
  link: {
    color: "#99cc45"
  }
};

const Footer = ({ classes }) => (
  <footer className={classes.footer}>
    <div>
      Powered by{" "}
      <a className={classes.link} href="https://nos.io/">
        nOS
      </a>.
    </div>
  </footer>
);

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(Footer);
