export interface AuthenticationResponse {
	scope: string;
	access_token: string;
	token_type: string;
	app_id: string;
	expires_in: number;
	nonce: string;
}

export interface LinkDescription {
	href: string;
	rel: string;
	method?: string;
	title?: string;
	mediaType?: string;
	encType?: string;
}

export interface AmountWithCurrencyCode {
	currency_code: string;
	value: string;
}

export interface AmountWithCurrencyCodeOptional {
	currency_code?: string;
	value: string;
}

export interface Capture {
	id: string;
	links: Array<LinkDescription>;
	amount: {
		value: string;
		currency_code?: string;
	};
	final_capture: boolean;
	status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED';
	status_details?: Record<string, any>;
	create_time?: string;
	update_time?: string;
	custom_id?: string;
	expiration_time?: string;
	seller_protection?: Record<string, any>;
	seller_receivable_breakdown?: {
		gross_amount?: AmountWithCurrencyCodeOptional;
		paypal_fee?: AmountWithCurrencyCodeOptional;
		net_amount?: AmountWithCurrencyCodeOptional;
	};
}

export interface PurchaseItem {
	name: string;
	quantity: string;
	unit_amount: AmountWithCurrencyCodeOptional;
	tax?: AmountWithCurrencyCodeOptional;
	description?: string;
	sku?: string;
	category?: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS' | 'DONATION';
}

type Authorization = Record<string, unknown>;
type Refunds = Record<string, unknown>;

export type Payments = {
	authorizations?: Authorization[];
	captures?: Capture[];
	refunds?: Refunds[];
};

export interface OrderResponse {
	id: string;
	create_time: string;
	status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
	intent: 'CAPTURE' | 'AUTHORIZE';
	links: Array<LinkDescription>;
	processing_instruction: 'ORDER_COMPLETE_ON_PAYMENT_APPROVAL' | 'NO_INSTRUCTION';
	purchase_units: Array<{
		amount: {
			value: string;
			currency_code?: string;
			breakdown?: {
				item_total?: AmountWithCurrencyCode;
				shipping?: AmountWithCurrencyCode;
				handling?: AmountWithCurrencyCode;
				tax_total?: AmountWithCurrencyCode;
				insurance?: AmountWithCurrencyCode;
				shipping_discount?: AmountWithCurrencyCode;
				discount?: AmountWithCurrencyCode;
			};
		};
		reference_id?: string;
		description?: string;
		custom_id?: string;
		invoice_id?: string;
		soft_descriptor?: string;
		payee?: {
			merchant_id?: string;
			email_address?: string;
		};
		items?: PurchaseItem[];
		payments?: Payments;
	}>;
}
