import { Slider } from '@material-ui/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'ui-kit/Form/Field';
import { Input } from 'ui-kit/Input';

interface IProps {
    value: number | Array<number>;
    onChange: (newVal: number | Array<number>) => void;
    min: number;
    max: number;
    step?: number;
}

export const Salary: React.FC<IProps> = ({ value, onChange, min, max }) => {
    const { t } = useTranslation(['Common']);
    const minValue = (value as number[])[0];
    const maxValue = (value as number[])[(value as number[]).length - 1];

    return (
        <Field
            row={false}
            label={t('Common:Salary.label')}
            component={
                <>
                    <div
                        className="row"
                        style={{ backgroundColor: 'white', margin: 0, boxShadow: '0 0px 1px 1px rgb(0 0 0 / 12%)' }}
                    >
                        <div className="col-5">
                            <Input
                                type="number"
                                style={{ boxShadow: 'none', padding: 0 }}
                                value={minValue === 0 ? '' : minValue}
                                onKeyDown={(event) => {
                                    if (['e', 'E', '-', '+', 'ArrowDown'].includes(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                rowsMin={min}
                                rowsMax={max}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const newVal = [
                                        Number(event.target.value),
                                        (value as number[])[(value as number[]).length - 1],
                                    ];
                                    onChange(newVal);
                                }}
                                placeholder="Min"
                                fullWidth
                            />
                        </div>
                        <div className="col-2" style={{ alignSelf: 'center' }}>
                            &mdash;
                        </div>
                        <div className="col-5">
                            <Input
                                type="number"
                                onKeyDown={(event) => {
                                    if (['e', 'E', '-', '+', 'ArrowDown'].includes(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                style={{ boxShadow: 'none', padding: 0 }}
                                value={maxValue === 0 ? '' : maxValue}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const newVal = [(value as number[])[0], Number(event.target.value)];
                                    onChange(newVal);
                                }}
                                placeholder="Max"
                                fullWidth
                            />
                        </div>
                    </div>
                    <Slider
                        style={{ paddingTop: 0 }}
                        getAriaValueText={() => `${value}`}
                        value={value}
                        onChange={(_: any, newValue: number[]) => {
                            onChange(newValue);
                        }}
                        max={max}
                        min={min}
                        valueLabelDisplay="off"
                        aria-labelledby="range-slider"
                    />
                </>
            }
        />
    );
};
