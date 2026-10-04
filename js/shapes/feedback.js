// Star Shapes feedback: the shared pick-one model configured for shapes.
import { SHAPES_VERSION, SHAPE_OPTIONS, NONE_OPTION, LIMITS } from './content.js';
import { createPickModel } from '../pick-feedback.js';

const model = createPickModel({
  title: 'All-Star Studio: star shape feedback',
  versionKey: 'shapesVersion',
  version: SHAPES_VERSION,
  options: SHAPE_OPTIONS,
  none: NONE_OPTION,
  limits: LIMITS,
  label: 'Favorite shape',
});

export const createEmptyShapeFeedback = model.createEmpty;
export const normalizeShapeFeedback = model.normalize;
export const shapeExportJson = model.exportJson;
export const shapeSummaryText = model.summaryText;
export const loadShapeFeedback = model.load;
