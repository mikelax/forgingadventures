import _ from 'lodash';
import React from 'react';
import { List } from 'semantic-ui-react';


export default function DiceRollResult(props) {
  const { rolls } = props;

  return (
    <List>
      {renderSummary()}
    </List>
  );

  function renderSummary() {
    return _.map(rolls, (die, index) => (
      <List.Item className="die" key={`die-result-${die}-${index}`}>
        <List.Header>{die.label}: {die.result.result} { '  ' }
          <span className="die-rolled">
            {die.input} = rolled({_.join(die.result.rolled, ', ')})
          </span>
        </List.Header>
      </List.Item>
    ));
  }

}
