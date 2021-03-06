import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import rockImg from "../../assets/rock.png";
import paperImg from "../../assets/paper.png";
import scissorsImg from "../../assets/scissors.png";

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
  },
  checked: {
    backgroundColor: "rgb(255, 202, 44)"
  }
};

class HandChoice extends React.Component {
  setHand = async event => {
    if (this.props.finished) {
      await this.props.clear();
    }

    if (this.props.disabled === true) {
      event.preventDefault();
    } else {
      this.props.chooseHand(event.target.value);
    }
  };

  render = () => {
    const { classes } = this.props;

    return (
      <hand-choice className={classes.header}>
        <div className={classes.handsBox}>
          <div>
            <label className={classes.picLabel} htmlFor="rock">
              <img
                src={rockImg}
                style={{ height: "80%" }}
                className={`${classes.pic} ${this.props.hand === "rock" ? classes.checked : ""}`}
                alt="rock"
              />
              <input
                className={classes.radio}
                id="rock"
                value="rock"
                type="radio"
                onClick={this.setHand}
              />
            </label>
          </div>
          <div>
            <label className={classes.picLabel} htmlFor="scissors">
              <img
                src={scissorsImg}
                alt="scissors"
                className={`${classes.pic} ${
                  this.props.hand === "scissors" ? classes.checked : ""
                }`}
              />
              <input
                className={classes.radio}
                id="scissors"
                value="scissors"
                type="radio"
                onClick={this.setHand}
              />
            </label>
          </div>
          <div>
            <label className={classes.picLabel} htmlFor="paper">
              <img
                src={paperImg}
                alt="paper"
                className={`${classes.pic} ${this.props.hand === "paper" ? classes.checked : ""}`}
              />
              <input
                className={classes.radio}
                id="paper"
                value="paper"
                type="radio"
                onClick={this.setHand}
              />
            </label>
          </div>
        </div>
      </hand-choice>
    );
  };
}

HandChoice.propTypes = {
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  chooseHand: PropTypes.func.isRequired,
  hand: PropTypes.string.isRequired,
  finished: PropTypes.bool.isRequired,
  clear: PropTypes.func.isRequired
};

export default injectSheet(styles)(HandChoice);
