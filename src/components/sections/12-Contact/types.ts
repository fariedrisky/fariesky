export interface ContactData {
    title: string;
    fields: {
        name: string;
        email: string;
        message: string;
    };
    submitText: string;
}
