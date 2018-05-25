import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

import rockImg from "../../assets/rock.jpg";
import paperImg from "../../assets/paper.jpg";
import scissorsImg from "../../assets/scissors.jpg";

const styles = {
  actionBox: {
    display: "flex",
    "justify-content": "center",
    alignItems: "center"
  },
  button: {
    width: "110px",
    height: "35px"
  },
  playerHand: {
    transform: "scaleX(-1)"
  }
};

const ActionHands = ({ classes }) => (
  <hend-choice>
    <div>
      <div className={classes.actionBox}>
        <img className={classes.playerHand} alt="Your hand" src={rockImg}/>
        <button className={classes.button}>GO</button>
        <img alt="Opponents hand" src={rockImg} />
      </div>
    </div>
  </hend-choice>
);

ActionHands.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(ActionHands);
