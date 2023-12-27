import * as React from 'react';
import { Box, Typography } from '@material-ui/core';

export const ValidationError: React.FC<{ error: string }> = ({ error }) => {
    return (
        <Typography component="div">
            <Box color="red" fontSize=".7rem" mb={2}>
                {error}
            </Box>
        </Typography>
    );
};
