import _ from 'lodash';
import React, { Component } from 'react';
import { Modal, Segment, Button, Form, Popup, List } from 'semantic-ui-react';
import { Formik, Form as FormikForm, Field, FieldArray } from 'formik';
import yup from 'yup';
import Roll from 'roll';

export default class DiceRollerModal extends Component {
  state = {
    rolls: []
  };

  render() {
    const { active } = this.props;

    return (
      <Modal
        open={active}
        closeOnDimmerClick={false}
        closeOnDocumentClick={false}
        onClose={this._handleClose}
      >
        <Modal.Header>Roll the Dice!</Modal.Header>
        <Modal.Content scrolling>
          <Modal.Description>
            <DiceRollForm />
          </Modal.Description>
        </Modal.Content>

        <Modal.Actions>
          <Button primary>
            Save
          </Button>
          <Button>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  _handleClose = (e) => {
    const { onDiceRolled } = this.props;
    const { rolls } = this.state;

    onDiceRolled({ rolls });
  }
}

function DiceRollForm(props) {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={validationSchema.default()}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      render={(props) => <DiceRoll formik={props} />}
    />
  );

  function handleSubmit(values) {

  }
}

function DiceRoll(props) {
  const { formik: { setFieldValue, values, values: { rolls } } } = props;
  console.log('values', values)
  return (
    <FieldArray
      name="rolls"
      render={arrayHelpers => (
        <Form as={FormikForm} size="mini" className="dice-roller">
          { _.map(rolls, (roll, index) => (
            <DiceRollItem
              key={`dice-roll-item-${index}`}
              roll={roll}
              index={index}
              setFieldValue={setFieldValue}
              canRemove={rolls.length > 1}
              onAdd={() => arrayHelpers.insert(index+1, { input: '', label: '' })}
              onRemove={() => arrayHelpers.remove(index)}
            />
          )) }
        </Form>
      )}
    />
  );
}

function DiceRollItem(props) {
  const { index, canRemove, onAdd, onRemove, setFieldValue } = props;

  return (
    <Segment className="dice-roll-item">
      <Form.Field>
        <Dice onSelectDice={die => setFieldValue(`rolls.${index}.input`, die)} />
      </Form.Field>

      <Form.Field>
        <label>Roll</label>
        <Field name={`rolls.${index}.input`} placeholder="Dice roll code" />
      </Form.Field>

      <Form.Field>
        <label>Description</label>
        <Field name={`rolls.${index}.label`} placeholder="Dice roll type or description" />
      </Form.Field>

      <Button.Group basic size='mini'>
        <Button type="button" onClick={onAdd}>Add another roll</Button>
        { canRemove && (
          <Button type="button" onClick={onRemove}>Remove this roll</Button>
        ) }
      </Button.Group>
    </Segment>
  );
}

function Dice(props) {
  const dice = [
    'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'
  ];

  return (
    <Button.Group basic size='mini'>
      {_.map(dice, die => (
        <Button
          key={`dice-roll-button-${die}`}
          type="button"
          onClick={() => props.onSelectDice(die)}
        >
          {die}
        </Button>
      ))}

      <Popup
        wide
        trigger={<Button icon="help" />}
        on='click'
        hideOnScroll
      >
        <p>Click one of the buttons to the left to add a roll or type in the roll manually.</p>
        <div>Examples</div>
        <List>
          <List.Item>d6 - random number between 1 and 6</List.Item>
          <List.Item>2d20 - random number between 2 and 40</List.Item>
          <List.Item>2d6+2 - random number between 3 and 14</List.Item>
          <List.Item>2d20+1d12 - random number between 3 and 52</List.Item>
          <List.Item>6d20b2 - roll 6 dice and give me the 2 highest</List.Item>
        </List>
      </Popup>
    </Button.Group>
  );

}

const validationSchema = yup.object().shape({
  rolls: yup.array().of(
    yup.object().shape({
      input: yup.string().default('').required(),
      label: yup.string().default('').required()
    })
  ).default([{
    input: '',
    label: ''
  }])
});


