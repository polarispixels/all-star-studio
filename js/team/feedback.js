// Team Star feedback: the shared pick-one model configured for team logo options.
import { TEAM_VERSION, TEAM_OPTIONS, NONE_OPTION, LIMITS } from './content.js';
import { createPickModel } from '../pick-feedback.js';

export const teamModel = createPickModel({
  title: 'All-Star Studio: Team Star feedback',
  versionKey: 'teamVersion',
  version: TEAM_VERSION,
  options: TEAM_OPTIONS,
  none: NONE_OPTION,
  limits: LIMITS,
  label: 'Favorite option',
});
