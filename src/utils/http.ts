export function getFormData(rest: any, file?: File): FormData {
    const formData: FormData = new FormData();

    if (file) {
        formData.append('file', file);
    }
    if (rest) {
        formData.append('rest', JSON.stringify(rest));
    }
    return formData;
}
