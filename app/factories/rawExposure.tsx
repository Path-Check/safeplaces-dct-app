import { Factory } from 'fishery';

import { daysAgo, beginningOfDay } from '../helpers/dateTimeUtils';
import { RawExposure } from '../bt/exposureNotifications';

export default Factory.define<RawExposure>(() => {
  const defaultDate = beginningOfDay(daysAgo(2));
  return {
    id: 'raw-exposure',
    date: defaultDate,
    duration: 300000,
    totalRiskScore: 4,
    transmissionRiskLevel: 7,
  };
});
