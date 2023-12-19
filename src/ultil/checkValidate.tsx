
export const CheckValidate = (value?: string) => {
    if (!value || value.length < 3) {
        return false;
    }
    return true;

}