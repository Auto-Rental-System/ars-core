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

export interface AmountWithCurrency {
	value: string;
	currency: string;
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

export interface PayoutItem {
	amount: AmountWithCurrency;
	receiver: string;
	recipient_type: 'EMAIL' | 'PHONE' | 'PAYPAL_ID';
	alternate_notification_method?: {
		phone?: {
			country_code: string;
			national_number: string;
			extension_number?: string;
		};
	};
	application_context?: {
		logo_url?: string;
		social_feed_privacy?: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
	};
	note?: string;
	notification_language?: string;
	recipient_wallet?: string;
	sender_item_id?: string;
}

export interface SenderBatchHeader {
	email_message?: string;
	email_subject?: string;
	note?: string;
	recipient_type?: string;
	sender_batch_id?: string;
}

export interface CreatePayoutBody {
	items: Array<PayoutItem>;
	sender_batch_header: SenderBatchHeader;
}

export interface CreatePayoutResponse {
	batch_header: {
		batch_status: 'DENIED' | 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'CANCELED';
		payout_batch_id: string;
		sender_batch_header: SenderBatchHeader;
		time_created?: string;
	};
	links: Array<LinkDescription>;
}

export interface PayoutBatchHeader {
	batch_status: 'DENIED' | 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'CANCELED';
	payout_batch_id: string;
	sender_batch_header: SenderBatchHeader;
	amount: AmountWithCurrency;
	fees: AmountWithCurrency;
	funding_source: 'BALANCE';
	time_closed?: string;
	time_completed?: string;
	time_created?: string;
}

export type PayoutItemTransactionStatus =
	| 'SUCCESS'
	| 'FAILED'
	| 'PENDING'
	| 'UNCLAIMED'
	| 'RETURNED'
	| 'ONHOLD'
	| 'BLOCKED'
	| 'REFUNDED'
	| 'REVERSED';

export interface PayoutResponseItem {
	payout_batch_id: string;
	payout_item: PayoutItem;
	payout_item_id: string;
	activity_id?: string;
	currency_conversion?: any;
	errors?: {
		debug_id: string;
		message: string;
		name: string;
		details?: Array<{
			issue: string;
			description?: string;
			field?: string;
			location?: string;
			value?: string;
		}>;
	};
	links: Array<LinkDescription>;
	payout_item_fee: AmountWithCurrency;
	time_processed: string;
	transaction_id: string;
	transaction_status: PayoutItemTransactionStatus;
}

export interface PayoutResponse {
	batch_header: PayoutBatchHeader;
	items: Array<PayoutResponseItem>;
	links: Array<LinkDescription>;
	total_items: number;
	total_pages: number;
}

export type PaypalWebhookEventType =
	| 'PAYMENT.PAYOUTS-ITEM.BLOCKED'
	| 'PAYMENT.PAYOUTS-ITEM.CANCELED'
	| 'PAYMENT.PAYOUTS-ITEM.DENIED'
	| 'PAYMENT.PAYOUTS-ITEM.FAILED'
	| 'PAYMENT.PAYOUTS-ITEM.HELD'
	| 'PAYMENT.PAYOUTS-ITEM.REFUNDED'
	| 'PAYMENT.PAYOUTS-ITEM.RETURNED'
	| 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED'
	| 'PAYMENT.PAYOUTS-ITEM.UNCLAIMED';

export interface PaypalWebhookBody<T> {
	id: string;
	event_version: string;
	create_time: string;
	resource_type: string;
	event_type: PaypalWebhookEventType;
	summary: string;
	resource: T;
}
