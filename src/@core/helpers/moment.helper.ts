import moment from 'moment-timezone';
import { TIME_ZONE_VALID } from '../environments/global.environment';
moment.locale('es');
moment.tz.setDefault('America/Lima');

export const onGetCurrentDate = (timeZone: string = 'America/Lima') => {
    timeZone = _verifiedTz(timeZone);

    return moment.utc().tz(timeZone).format();
};

export const onGetCurrentYear = (timeZone: string = 'America/Lima') => {
    timeZone = _verifiedTz(timeZone);

    return moment.utc().tz(timeZone).year();
};


const _verifiedTz = (timezone: string): string => {
    if (!TIME_ZONE_VALID.includes(timezone)) return 'America/Lima';

    return timezone;
};
