import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import Variable from '../../services/var';

class ChoiceComponent extends React.Component {
  constructor(props) {
    super(props);
    this.vars = new Variable();
  }

  render() {
    return (
      <div>
        Reward
        <div>
          {
            this.props.choicesChosen.map(c => (
              <Button
                key={c.currentPointer + "-" + c.name}>
                <Icon link name="x" onClick={() => { this.props.removeChoice(c); }} />
                {c.value}
              </Button>
            ))
          }
        </div>
        <div className="text-center">
          {
            this.props.choicesToChoose.map(o => (
              <Button
                size="medium"
                key={o.currentPointer + "-" + o.value}
                onClick={() => { this.props.addChoice(o); }}
                content={o.name} />
            ))
          }
        </div>
      </div>
    );
  }
}

ChoiceComponent.propTypes = {
  addChoice: React.PropTypes.func.isRequired,
  removeChoice: React.PropTypes.func.isRequired,
  choicesChosen: React.PropTypes.any,
  choicesToChoose: React.PropTypes.any
};

export default ChoiceComponent;
