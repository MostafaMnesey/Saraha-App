export const findOne = async ({
  model,
  optaions = {},
  filter = {},
  select = "",
  populate = "",
} = {}) => {
  return await model
    .findOne(filter, optaions)
    .select(select)
    .populate(populate);
};
export const findById = async ({
  model,
  optaions = {},
  id,
  select = "",
  populate = "",
} = {}) => {
  return await model.findById(id, optaions).select(select).populate(populate);
};

export const create = async ({ model, data = [{}], optaions = {} } = {}) => {
  return await model.create(data, optaions);
};

export const updateOne = async ({
  model,
  filter = {},
  data = {},
  optaions = {},
} = {}) => {
  return await model.updateOne(filter, data, optaions);
};
