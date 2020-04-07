const convertMonthsToDays = (months) => months * 30;
const convertWeeksToDays = (weeks) => weeks * 7;

const getNumberOfDays = (periodType, timeToElapse) => {
  switch (periodType) {
    case 'months':
      return convertMonthsToDays(timeToElapse);
    case 'weeks':
      return convertWeeksToDays(timeToElapse);
    default:
      return timeToElapse;
  }
};

const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse
  } = data;

  const impact = {};
  const severeImpact = {};

  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;

  const infectionRate = Math.trunc(getNumberOfDays(periodType, timeToElapse) / 3);


  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * (2 ** infectionRate);
  impact.infectionsByRequestedTime = impact.currentlyInfected * (2 ** infectionRate);


  return {
    data,
    impact,
    severeImpact
  };
};


export default covid19ImpactEstimator;
