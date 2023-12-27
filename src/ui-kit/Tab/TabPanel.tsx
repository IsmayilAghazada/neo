import * as React from 'react';
import { Box, Typography } from '@material-ui/core';

import './index.scss';

interface IProps {
    children?: React.ReactNode;
    index: unknown;
    value: unknown;
    padding?: string;
    scrollable?: boolean;
}

export const TabPanel: React.FC<IProps> = ({ padding = 3, children, value, index, scrollable = true, ...other }) => {
    return (
        <div
            className={scrollable && 'tab-panel__scrollable'}
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-prevent-tabpanel-${index}`}
            aria-labelledby={`scrollable-prevent-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box style={{ padding }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};
