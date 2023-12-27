import { IBrowserStorageItem, IStorage } from './models';

export class BrowserStorageItem<T> implements IBrowserStorageItem<T> {
    public constructor(private readonly key: string, private readonly storage: IStorage) {}

    public setValue(value: T): void {
        if (this.storage && value != null) {
            this.storage.setItem(this.key, JSON.stringify(value));
        }
    }

    public getValue(): T | null {
        if (this.storage) {
            const storedValue = this.storage.getItem(this.key);
            let valueFromStorage;

            try {
                valueFromStorage = storedValue != null ? JSON.parse(storedValue) : null;
            } catch (error) {
                // Some clients may still have not json.stringified values in storage (old implementation).
                // Example: old variant - 'some string', new variant '"some string"'.
                // In case of old variant value just return it as it is.
                valueFromStorage = storedValue as any;
            }

            return valueFromStorage;
        }
        return null;
    }

    public clearValue(): void {
        if (this.storage) {
            this.storage.removeItem(this.key);
        }
    }

    public hasValue(): boolean {
        return this.storage && Boolean(this.getValue() != null);
    }
}
