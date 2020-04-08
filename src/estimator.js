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

// const calcDollarsInFlight = (infections,
//   dayInc,
//   popInc,
//   period) => infections * dayInc * popInc * period;


const calculateImpact = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds
    // region
  } = data;

  const impact = {};

  impact.currentlyInfected = reportedCases * 10;

  const infectionRate = Math.trunc(getNumberOfDays(periodType, timeToElapse) / 3);

  impact.infectionsByRequestedTime = impact.currentlyInfected * (2 ** infectionRate);

  impact.severeCasesByRequestedTime = impact.infectionsByRequestedTime * 0.15;

  impact.hospitalBedsByRequestedTime = calcHospitalSpace(
    totalHospitalBeds,
    impact.severeCasesByRequestedTime
  );

  impact.casesForICUByRequestedTime = calcReqIcuCare(impact.infectionsByRequestedTime);

  impact.casesForVentilatorsByRequestedTime = calcReqVent(impact.infectionsByRequestedTime);

  // impact.dollarsInFlight = calcDollarsInFlight(
  //   impact.infectionsByRequestedTime,
  //   region.avgDailyIncomeInUSD,
  //   region.avgDailyIncomePopulation,
  //   getNumberOfDays(periodType, timeToElapse)
  // );

  return impact;
};

const calculateSevereImpact = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds
    // region
  } = data;

  const severeImpact = {};

  severeImpact.currentlyInfected = reportedCases * 50;

  const infectionRate = Math.trunc(getNumberOfDays(periodType, timeToElapse) / 3);

  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * (2 ** infectionRate);

  severeImpact.severeCasesByRequestedTime = severeImpact.infectionsByRequestedTime * 0.15;

  severeImpact.hospitalBedsByRequestedTime = calcHospitalSpace(
    totalHospitalBeds,
    severeImpact.severeCasesByRequestedTime
  );

  severeImpact.casesForICUByRequestedTime = calcReqIcuCare(severeImpact.infectionsByRequestedTime);


  severeImpact.casesForVentilatorsByRequestedTime = calcReqVent(
    severeImpact.infectionsByRequestedTime
  );

  // severeImpact.dollarsInFlight = calcDollarsInFlight(
  //   severeImpact.infectionsByRequestedTime,
  //   region.avgDailyIncomeInUSD,
  //   region.avgDailyIncomePopulation,
  //   getNumberOfDays(periodType, timeToElapse)
  // );

  return severeImpact;
};

const covid19ImpactEstimator = (data) => {
  const impact = calculateImpact(data);
  const severeImpact = calculateSevereImpact(data);

  return {
    data,
    impact,
    severeImpact
  };
};


export default covid19ImpactEstimator;
