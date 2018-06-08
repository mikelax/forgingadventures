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
        <List.Header>{ die.input } = {die.result.result}</List.Header>
        { die.label } - rolled({ _.join(die.result.rolled, ', ') })
      </List.Item>
    ));
  }

}
