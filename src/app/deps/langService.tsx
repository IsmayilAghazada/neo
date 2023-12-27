import * as i18n from 'i18next';
import { ELanguage } from '../../enums';

import { IMessage, IMessageBus } from './messageBus';

export type LanguageChangeMessage = IMessage<'LANGUAGE_CHANGE', ELanguage>;
export interface ILangService {
    changeLanguage: (lang: ELanguage) => void;
    getCurrentLang: () => ELanguage;
    onLanguageChanged(handler: (lang: ELanguage) => void): () => void;
    setCurrentLangToHTML: () => void;
}

export class LangService implements ILangService {
    public constructor(private messageBus: IMessageBus, private i18nInstance: i18n.i18n) {}

    public setCurrentLangToHTML = (): void => {
        document.getElementsByTagName('html')[0].setAttribute('lang', this.getCurrentLang());
    };

    public getCurrentLang = () => this.i18nInstance.language as ELanguage;

    public changeLanguage = (lang: ELanguage): void => {
        if (lang !== this.getCurrentLang()) {
            this.messageBus.publish<LanguageChangeMessage>({
                payload: lang,
                type: 'LANGUAGE_CHANGE',
            });
        }
    };

    public onLanguageChanged(handler: (lang: ELanguage) => void): () => void {
        return this.messageBus.subscribe<LanguageChangeMessage>(({ payload: lang }) => {
            this.i18nInstance.changeLanguage(lang as ELanguage, () => {
                handler(lang!);
                this.setCurrentLangToHTML();
            });
        }, 'LANGUAGE_CHANGE');
    }
}
