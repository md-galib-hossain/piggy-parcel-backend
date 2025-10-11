export interface EmailData {
	subject: string;
	html: string;
}

export interface EmailTemplate {
	render(data: any): EmailData;
}
