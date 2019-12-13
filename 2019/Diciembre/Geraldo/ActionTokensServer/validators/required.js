import RequiredParameterError from '../helpers/errors';

export default function requiredParam (param) {
  throw new RequiredParameterError(param)
}