import { v4 as uuidv4 } from 'uuid'

export const generateOptimisticBrew = (
  formValues,
  { coffees, brewingMethods }
) => {
  return {
    coffee: {
      ...coffees.find((coffee) => coffee._id === formValues.coffee),
    },
    date: new Date().toISOString(),
    dose: formValues.dose,
    grindSetting: formValues.grindSetting,
    brewingMethod: {
      ...brewingMethods.find(
        (method) => method._id === formValues.brewingMethod
      ),
    },
    notes: formValues.notes,
    rating: formValues.rating,
    temperature: formValues.temperature,
    time: formValues.time,
    yield: formValues.yield,
    __v: 0,
    // the id is checked in the AccordionItemWithMenu so the menu is disabled if it's an optimistic update placeholder
    _id: `optimistic-${uuidv4()}`,
  }
}
