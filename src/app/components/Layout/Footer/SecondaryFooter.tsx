import * as React from 'react';
import { Trans } from 'react-i18next';
import { CustomTooltip } from 'ui-kit/ToolTips';
import './index.scss';

export const SecondaryFooter: React.FC = ({ children = null }) => {
    const year = new Date().getFullYear();
    return (
        <div>
            {children}
            <div className="secondary-footer margin-top-15">
                <div className="secondary-footer-copyrights">
                    <Trans values={{ year }} i18nKey="Copyrights" components={[<strong />]} ns="Common" />
                </div>
                <ul className="footer-social-links">
                    <li>
                        <CustomTooltip type="dark" placement="bottom" title="Facebook">
                            <a rel="noreferrer noopener" target="_blank" href="https://fb.com/doqquz">
                                <i className="icon-brand-facebook-f" />
                            </a>
                        </CustomTooltip>
                    </li>
                    <li>
                        <CustomTooltip type="dark" placement="bottom" title="Twitter">
                            <a rel="noreferrer noopener" target="_blank" href="https://twitter.com/9_doqquz">
                                <i className="icon-brand-twitter" />
                            </a>
                        </CustomTooltip>
                    </li>
                    <li>
                        <CustomTooltip type="dark" placement="bottom" title="Telegram">
                            <a rel="noreferrer noopener" target="_blank" href="https://t.me/doqquzbaku">
                                <i className="icon-brand-telegram" />
                            </a>
                        </CustomTooltip>
                    </li>
                    <li>
                        <CustomTooltip type="dark" placement="bottom" title="LinkedIn">
                            <a
                                rel="noreferrer noopener"
                                target="_blank"
                                href="https://www.linkedin.com/company/doqquz/"
                            >
                                <i className="icon-brand-linkedin-in" />
                            </a>
                        </CustomTooltip>
                    </li>
                </ul>

                <div className="clearfix" />
            </div>
        </div>
    );
};
