import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import rockImg from "../../assets/rock.png";
import paperImg from "../../assets/paper.jpg";
import scissorsImg from "../../assets/scissors.jpg";

const styles = {
  header: {
    backgroundColor: "#f0f0f0",
    color: "#333333",
    padding: "24px",
    marginBottom: "32px"
  },
  title: {
    fontSize: "1.5em"
  },
  radio: {
    visibility: "hidden",
    position: "absolute"
  },
  handsBox: {
    display: "flex",
    "justify-content": "center"
  },
  pic: {
    width: "75px",
    height: "75px",
    padding: "5px",
    transform: "rotate(90deg)"
  },
  picLabel: {
    cursor: "pointer"
  }
};

const HandChoice = ({ classes }) => (
  <hand-choice className={classes.header}>
    <div className={classes.handsBox}>
      <div>
        <label className={classes.picLabel} htmlFor="rock">
          <img src={rockImg} style={{ height: "80%" }} className={classes.pic} alt="rock" />
          <input className={classes.radio} id="rock" type="radio" />
        </label>
      </div>
      <div>
        <label className={classes.picLabel} htmlFor="scissors">
          <img src={scissorsImg} className={classes.pic} alt="scissors" />
          <input className={classes.radio} id="scissors" type="radio" />
        </label>
      </div>
      <div>
        <label className={classes.picLabel} htmlFor="paper">
          <img src={paperImg} className={classes.pic} alt="paper" />
          <input className={classes.radio} id="paper" type="radio" />
        </label>
      </div>
    </div>
  </hand-choice>
);

HandChoice.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(HandChoice);
