/**
 *
 * @param months
 *
 * Takes the number of months and convert it to days
 */
const convertMonthsToDays = (months) => months * 30;

/**
 *
 * @param weeks
 *
 * Takes the number of weeks anc converts it to days
 */
const convertWeeksToDays = (weeks) => weeks * 7;

/**
 *
 * @param periodType
 * @param timeToElapse
 *
 * Takes the periodType and the timeToElapse and returns the days equivalent.
 */
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

/**
 *
 * @param hospitalBeds
 * @param casesByTime
 *
 * Takes the number of hospitalBeds and cases by times and
 * return the number of hosipita beds that will be availaible by requested time.
 */
const calcHospitalSpace = (hospitalBeds, casesByTime) => Math.trunc(
  (hospitalBeds * 0.35) - casesByTime
);

const calcReqIcuCare = (severe) => Math.trunc(severe * 0.05);

const calcReqVent = (severe) => Math.trunc(severe * 0.02);

const calcDollarsInFlight = (infections,
  dayInc,
  popInc,
  period) => Math.trunc((infections * dayInc * popInc) / period);


const calculateImpact = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region
  } = data;

  const impact = {};

  impact.currentlyInfected = reportedCases * 10;

  const infectionRate = Math.trunc(getNumberOfDays(periodType, timeToElapse) / 3);

  impact.infectionsByRequestedTime = Math.trunc(impact.currentlyInfected * (2 ** infectionRate));

  impact.severeCasesByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.15);

  impact.hospitalBedsByRequestedTime = calcHospitalSpace(
    totalHospitalBeds,
    impact.severeCasesByRequestedTime
  );

  impact.casesForICUByRequestedTime = calcReqIcuCare(impact.infectionsByRequestedTime);

  impact.casesForVentilatorsByRequestedTime = calcReqVent(impact.infectionsByRequestedTime);

  impact.dollarsInFlight = calcDollarsInFlight(
    impact.infectionsByRequestedTime,
    region.avgDailyIncomeInUSD,
    region.avgDailyIncomePopulation,
    getNumberOfDays(periodType, timeToElapse)
  );

  return impact;
};

/**
 *
 * @param data
 *
 * Calculates the wort case scenario for the given data input
 */

const calculateSevereImpact = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region
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

  severeImpact.dollarsInFlight = calcDollarsInFlight(
    severeImpact.infectionsByRequestedTime,
    region.avgDailyIncomeInUSD,
    region.avgDailyIncomePopulation,
    getNumberOfDays(periodType, timeToElapse)
  );

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
