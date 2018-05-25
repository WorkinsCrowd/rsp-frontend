import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

import Header from "./../../components/Header";
import HandChoice from "./../../components/HandChoice";
import OpponentChoice from "./../../components/OpponentChoice";
import ActionHands from "./../../components/ActionHands";
import NOSActions from "./../../components/NOSActions";

const styles = {
  "@import": "https://fonts.googleapis.com/css?family=Source+Sans+Pro",
  "@global html, body": {
    fontFamily: "Source Sans Pro",
    margin: 0,
    padding: 0,
    backgroundColor: "#ffffff"
  }
};

const App = ({ classes }) => (
  <div className={classes.App}>
    <Header title="rock scissors paper" />
    <OpponentChoice />
    <HandChoice />
    <ActionHands />
  </div>
);

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(App);
