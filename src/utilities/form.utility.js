export function formIsValid(fields) {
    return fields.every(field => field.errors.length === 0);
}