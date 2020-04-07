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

const calcHospitalSpace = (hospitalBeds, casesByTime) => (hospitalBeds * 0.35) - casesByTime;

const calcReqIcuCare = (severe) => severe * 0.05;

const calcReqVent = (severe) => severe * 0.02;

const calcDollarsInFlight = (infections, dayInc, popInc) => infections * dayInc * popInc * 30;

const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region
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

  impact.hospitalBedsByRequestedTime = calcHospitalSpace(
    totalHospitalBeds,
    impact.severeCasesByRequestedTime
  );

  severeImpact.hospitalBedsByRequestedTime = calcHospitalSpace(
    totalHospitalBeds,
    severeImpact.severeCasesByRequestedTime
  );

  impact.casesForICUByRequestedTime = calcReqIcuCare(impact.infectionsByRequestedTime);
  severeImpact.casesForICUByRequestedTime = calcReqIcuCare(severeImpact.infectionsByRequestedTime);

  impact.casesForVentilatorsByRequestedTime = calcReqVent(impact.infectionsByRequestedTime);

  severeImpact.casesForVentilatorsByRequestedTime = calcReqVent(
    severeImpact.infectionsByRequestedTime
  );

  // impact.dollarsInFlight = calcDollarsInFlight(
  //   impact.infectionsByRequestedTime,
  //   region.avgDailyIncomeInUSD,
  //   region.avgDailyIncomePopulation
  // );

  // severeImpact.dollarsInFlight = calcDollarsInFlight(
  //   severeImpact.infectionsByRequestedTime,
  //   region.avgDailyIncomeInUSD,
  //   region.avgDailyIncomePopulation
  // );

  return {
    data,
    impact,
    severeImpact
  };
};


export default covid19ImpactEstimator;
