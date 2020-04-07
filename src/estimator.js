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
    timeToElapse,
    totalHospitalBeds
  } = data;

  const impact = {};
  const severeImpact = {};

  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;

  const infectionRate = Math.trunc(getNumberOfDays(periodType, timeToElapse) / 3);

  impact.infectionsByRequestedTime = impact.currentlyInfected * (2 ** infectionRate);
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * (2 ** infectionRate);

  impact.severeCasesByRequestedTime = impact.infectionsByRequestedTime * 0.15;
  severeImpact.severeCasesByRequestedTime = severeImpact.infectionsByRequestedTime * 0.15;

  impact.hospitalBedsByRequestedTime = Math.trunc(totalHospitalBeds * 0.35);
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(totalHospitalBeds * 0.35);


  return {
    data,
    impact,
    severeImpact
  };
};


export default covid19ImpactEstimator;
