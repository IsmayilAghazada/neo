import { Button, Chip, createStyles, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Input } from 'ui-kit/Input';
import * as React from 'react';
import { Field } from 'ui-kit/Form/Field';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) =>
    createStyles({
        addButton: {
            height: 36,
            width: 36,
            minWidth: 36,
        },
        chipWrapper: {
            display: 'flex',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: theme.spacing(3),
            marginTop: theme.spacing(1),
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
    }),
);

interface IProps {
    value: string[];
    onChange: (keywords: string[]) => void;
    placeholder?: string;
}

export const Keyword: React.FC<IProps> = ({ value, onChange, placeholder = null }) => {
    const classes = useStyles();
    const [inputVal, setInputVal] = React.useState('');
    const { t } = useTranslation(['Common']);
    const handleAdd = () => {
        if (inputVal?.trim().length) {
            onChange(value.some((k) => k === inputVal) ? [...value] : [...value, inputVal]);
        }
        setInputVal('');
    };
    const handleDelete = (keyword: string) => {
        onChange(value.filter((k) => k !== keyword));
    };

    return (
        <>
            <Field
                label={t('Common:Keyword.label')}
                component={
                    <Input
                        placeholder={placeholder ?? t('Common:Keyword.placeholder')}
                        inputProps={{ 'aria-label': placeholder ?? t('Common:Keyword.placeholder') }}
                        onChange={(event) => setInputVal(event.target.value)}
                        value={inputVal}
                        disabled={Boolean(value.length > 10)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleAdd();
                            }
                        }}
                        endAdornment={
                            <Button
                                className={classes.addButton}
                                variant="contained"
                                color="secondary"
                                component="span"
                                onClick={handleAdd}
                            >
                                <Add />
                            </Button>
                        }
                    />
                }
            />
            <div className={classes.chipWrapper}>
                {value.map((keyword, i) => (
                    <Chip key={i} label={keyword} onDelete={() => handleDelete(keyword)} color="secondary" />
                ))}
            </div>
        </>
    );
};
