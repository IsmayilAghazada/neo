/* eslint-disable no-console */
import * as moment from 'moment';
import * as ReactGA from 'react-ga';

interface IAnalyticsEventBase {
    action: any;
    category: any;
    label?: any;
    value?: number;
}

export interface IAnalyticsEvent extends IAnalyticsEventBase {
    duration?: number;
}

export interface IRawAnalyticsEvent extends IAnalyticsEventBase {
    dimension1: string;
    metric1?: number;
}

export interface IAnalyticsService {
    init: () => void;
    sendEvent: (_event: IAnalyticsEvent) => void;
    sendPageView: (viewUrl: string) => void;
    setUserId: (userId: string) => void;
}

export class AnalyticsService implements IAnalyticsService {
    private readonly trackingId: string;

    public constructor() {
        this.trackingId = 'UA-186753509-1';
    }

    public init = () => {
        ReactGA.initialize(this.trackingId);

        console.log(`Google analytics initialized with tracking id: ${this.trackingId}`);
    };

    private mapEvent(_event: IAnalyticsEvent): IRawAnalyticsEvent {
        const { duration, ...event } = _event;
        const mappedEvent: IRawAnalyticsEvent = {
            ...event,
            dimension1: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };

        if (duration) {
            mappedEvent.metric1 = duration;
        }

        return mappedEvent;
    }

    public sendEvent = (_event: IAnalyticsEvent) => {
        const event = this.mapEvent(_event);

        this.reportHandler(ReactGA.event, event);
    };

    public sendPageView = (page: string) => {
        ReactGA.set({ page });

        this.reportHandler(ReactGA.pageview, page);
    };

    private reportHandler = <T>(callback: (arg: T) => void, reportArg: T) => {
        callback(reportArg);
        console.log('Google Analytics report dispatched:', { reportArg });
    };

    public setUserId = (userId: string) => {
        ReactGA.set({ userId });
        console.log(`Google analytics user id was set to '${userId}'`);
    };
}
