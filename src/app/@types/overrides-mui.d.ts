/* eslint-disable @typescript-eslint/no-empty-interface */
import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';

type overridesNameToClassKey = {
    [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
};

declare module '@material-ui/core/styles/overrides' {
    export interface ComponentNameToClassKey extends overridesNameToClassKey {}
}
