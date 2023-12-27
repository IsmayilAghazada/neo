import { FormControlLabel, Switch } from '@material-ui/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'ui-kit/Form/Field';

interface IProps {
    value: { [x: string]: boolean }[];
    onChange: (newVal: { [x: string]: boolean }[]) => void;
}
export const JobType: React.FC<IProps> = ({ value, onChange }) => {
    const { t } = useTranslation('Common');
    const handleJobTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(
            value.map((x) =>
                Object.keys(x)[0] === event.target.name ? { [event.target.name]: event.target.checked } : x,
            ),
        );
    };

    return (
        <Field
            row={false}
            label={t('JobType.label')}
            component={value.map((x, index) => (
                <FormControlLabel
                    key={index}
                    control={
                        <Switch
                            checked={Object.values(x)[0]}
                            key={index}
                            onChange={handleJobTypeChange}
                            name={Object.keys(x)[0]}
                        />
                    }
                    label={t(`JobType.${Object.keys(x)[0]}`)}
                />
            ))}
        />
    );
};
