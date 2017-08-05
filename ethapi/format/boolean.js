// @flow

function booleanInput (value/*: string | boolean */)/*: boolean */ {
  if (value === 'false') {
    return false;
  }

  return !!value;
}

function booleanOutput (value/*: string | boolean */)/*: boolean */ {
  return booleanInput(value);
}

module.exports = {
  booleanInput,
  booleanOutput
};
