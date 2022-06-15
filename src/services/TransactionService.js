import Cart from "../models/Cart";

import Transaction from "../models/Transaction";

import PagarMeProvider from "../providers/PagarMeProvider";

import {v4 as uuidv4} from "uuid";

class TransactionService {
	paymentProvider;

	constructor(paymentProvider){
		this.paymentProvider = paymentProvider || new PagarMeProvider();
	}
	
	async process({
		cartCode,
		paymentType,
		installments,
		customer,
		billing,
		creditCard
	}) {

		const cart = await Cart.findOne({code: cartCode});

		if (!cart) {
			throw `${cartCode} don't find`;
		}

		const transaction = await Transaction.create({
			cartCode: cart.code,
			code: await uuidv4(),
			total: cart.price,
			status: "started",
			paymentType,
			installments,
			customerName: customer.name,
			customerEmail: customer.email,
			customerMobile: customer.mobile,
			customerDocument: customer.document,
			billingAddress: billing.address,
			billingNumber: billing.number,
			billingNeighborhood: billing.neighborhood,
			billingCity: billing.city,
			billingState: billing.state,
			billingZipCode: billing.zipcode,
		});

		this.paymentProvider.process({
			transactionCode: transaction.code,
			total: transaction.total,
			paymentType,
			installments,
			customer,
			creditCard,
			billing,
		});

		return transaction;
	}
}

export default TransactionService;