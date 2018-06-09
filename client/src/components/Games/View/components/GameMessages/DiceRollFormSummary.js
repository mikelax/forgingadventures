import _ from 'lodash';
import React from 'react';
import { Segment, List, Header, Button } from 'semantic-ui-react';

import InlineItemsLoader from 'components/shared/components/InlineItemsLoader';

export default function DiceRollFormSummary(props) {
  const { rolls } = props;

  return (
    <InlineItemsLoader items={rolls}>
      <Segment className="dice-roll-summary">
        <Header size='tiny'>Will roll the following dice</Header>

        <List divided verticalAlign="middle">
          {renderSummary()}
        </List>
      </Segment>
    </InlineItemsLoader>
  );

  function renderSummary() {
    return _.map(rolls, (die, index) => (
      <List.Item className="die" key={`die-summary-${die}-${index}`}>

        <List.Content floated='right'>
          <Button icon="delete" color="grey" size="mini" onClick={handleDelete(die)} />
        </List.Content>

        <List.Header>{ die.input }</List.Header>
        { die.label }
      </List.Item>
    ));
  }

  function handleDelete(die) {
    const { onRemove } = props;

    return () => {
      onRemove(die);
    };
  }

}
