import * as React from 'react';
import { makeStyles, Theme, createStyles, Typography, useTheme, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'fixed',
            bottom: theme.spacing(10),
            right: theme.spacing(2),
            backgroundColor: 'rgba(0, 0, 0, 0.87)',
            padding: '8px 16px',
            borderRadius: theme.spacing(1),
            cursor: 'pointer',
            zIndex: 2,
            '&:hover': {
                textDecoration: 'none',
            },
            [theme.breakpoints.down('md')]: {
                padding: 12,
                borderRadius: '50%',
            },
        },
    }),
);

export const ReportToTelegram: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation(['Common']);
    const theme = useTheme();
    const reportBtnRef = React.useRef(null);
    const isMob = useMediaQuery(theme.breakpoints.down('md'));
    const handleOnScroll = () => {
        const fixedPosition = reportBtnRef.current?.getBoundingClientRect()?.top;
        const fixedHeight = reportBtnRef.current?.clientHeight;

        const toCrossPosition = document.getElementById('footer')?.getBoundingClientRect()?.top;

        if (fixedPosition + fixedHeight > toCrossPosition) {
            reportBtnRef.current.style = `top: ${toCrossPosition - 48}px; bottom: initial`;
        } else {
            reportBtnRef.current.style = `top: initial;bottom: 80px`;
            const modifiedFixedPosition = reportBtnRef.current?.getBoundingClientRect()?.top;
            const modifiedHeight = reportBtnRef.current?.clientHeight;
            const modifiedToCrossPosition = document.getElementById('footer')?.getBoundingClientRect()?.top;

            if (modifiedFixedPosition + modifiedHeight > modifiedToCrossPosition) {
                reportBtnRef.current.style = `top: ${toCrossPosition - 48}px; bottom: initial`;
            } else {
                reportBtnRef.current.style = `top: initial;bottom: 80px`;
            }
        }
    };
    const handleOnScrollWithDebounce = React.useCallback(
        debounce(handleOnScroll, 50, {
            leading: false,
            trailing: true,
        }),
        [],
    );

    React.useEffect(() => {
        window.addEventListener('scroll', handleOnScrollWithDebounce);
        setTimeout(handleOnScroll, 200);
        return () => window.removeEventListener('scroll', handleOnScrollWithDebounce);
    }, []);

    return (
        <a
            ref={reportBtnRef}
            target="_blank"
            rel="noreferrer noopener"
            href="https://t.me/Doqquzistifadecisorgulari"
            className={classes.root}
        >
            {!isMob && (
                <Typography color="primary" variant="button" component="span">
                    {t('Common:Questions.report')}
                </Typography>
            )}
            <img style={!isMob ? { marginLeft: 16 } : {}} src="/assets/images/direct.svg" alt="" />
        </a>
    );
};
