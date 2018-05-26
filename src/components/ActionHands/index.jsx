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
  },

  "hand-left-shake": {
    animation: "shake-left-a 2s linear both infinite",
    backfaceVisibility: "hidden",
    perspective: "1000px"
  },
  "hand-right-shake": {
    animation: "shake-right-a 2s linear both infinite",
    backfaceVisibility: "hidden",
    perspective: "1000px"
  }
};
class ActionHands extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerChoiceDone: false,
      leftHandClass: this.handsClasses(false, "left"),
      rightHandClass: this.handsClasses(false, "right")
    };
  }

  componentDidMount = async () => {};

  handsClasses = (shake, hand) => {
    const { classes } = this.props;
    const applied = [];

    if (shake) {
      applied.push(classes[`hand-${hand}-shake`]);
    }

    return applied.join(" ");
  };

  handleGoClick = async e => {
    await this.setState({
      playerChoiceDone: true,
      leftHandClass: this.handsClasses(true, "left"),
      rightHandClass: this.handsClasses(true, "right")
    });
  };

  render = () => {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div>
          <div className={classes.actionBox}>
            <img
              className={`${this.state.leftHandClass} ${classes.playerHand}`}
              alt="Your hand"
              src={rockImg}
            />
            <button className={classes.button} onClick={this.handleGoClick}>
              GO
            </button>
            <img className={this.state.rightHandClass} alt="Opponents hand" src={rockImg} />
          </div>
        </div>
      </React.Fragment>
    );
  };
}

ActionHands.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(ActionHands);
