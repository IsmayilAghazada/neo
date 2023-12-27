import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { i18nInstance } from '../i18n';
import { App } from './App';

import './index.scss';

i18nInstance.init(() => {
    ReactDOM.render(
        <I18nextProvider i18n={i18nInstance}>
            <App />
        </I18nextProvider>,
        document.getElementById('wrapper'),
    );
});
