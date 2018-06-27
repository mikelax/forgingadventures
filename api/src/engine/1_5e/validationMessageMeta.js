import Yup from 'yup';
import Roll from 'roll';

export default Yup.object().shape({
  rolls: Yup.array().of(
    Yup.object().shape({
      input: Yup.string().required()
        .test('valid-roll', '${value} is not a valid dice roll', diceRollTest), // eslint-disable-line
      label: Yup.string().required()
    })
  )
});

function diceRollTest(value) {
  if (value) {
    const roll = new Roll();

    return roll.validate(value);
  }
}
