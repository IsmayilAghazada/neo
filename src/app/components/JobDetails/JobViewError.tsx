import { IError } from 'model';
import * as React from 'react';
// import { useTranslation } from 'react-i18next';
import { NoRecordsPanel } from 'ui-kit/NoRecordsPanel';
import { ServerErrorPanel } from 'ui-kit/ServerErrorPanel';

export const JobViewError: React.FC<{ error: IError }> = ({ error }) => {
    // const { t } = useTranslation(['Company', 'Common']);
    return (
        <div className="container">
            {error.httpCode !== 404 ? (
                <div className="row">
                    <div className="col-xl-12 col-lg-12 content-right-offset">
                        <ServerErrorPanel code="404" text="Not Found" />
                    </div>
                </div>
            ) : (
                <div className="row">
                    <div className="col-xl-12 col-lg-12 content-right-offset">
                        <NoRecordsPanel />
                    </div>
                </div>
            )}
        </div>
    );
};
