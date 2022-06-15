
import * as Yup from "yup";

import parsePhoneNumber from "libphonenumber-js";

import {cpf, cnpj} from "cpf-cnpj-validator";

import Cart from "../models/Cart";

import TransactionService from "../services/TransactionService";

class TransactionsController {

	async create(req, res) {
		try {

			//transformando o body do post em um schema para pós validação

			const {
				cartCode,
				paymentType,
				installments,
				customerName,
				customerEmail,
				customerMobile,
				customerDocument,
				billingAddress,
				billingNumber,
				billingNeighborhood,
				billingCity,
				billingState,
				billingZipCode,
				creditCardNumber,
				creditCardExpiration,
				creditCardHolderName,
				creditCardCvv
			} = req.body;

			//utilizando o yup para validar o schema

			const schema = Yup.object({

				cartCode: Yup.string().required(),

				paymentType: Yup.mixed().oneOf(["credit_card", "billet"]).required(),

				installments: Yup.number().min(1)
				.when("paymentType", (paymentType, schema) => paymentType === "credit_card" ? schema.max(12) : schema.max(1)),

				customerName: Yup.string().required().min(3),

				customerEmail: Yup.string().required().email(),

				//validando o numero de celular com a biblioteca libphonenumber-js
				customerMobile: Yup.string()
				.required()
				.test("is-valid-mobile", "${path} is not a valid phone number!", 
				(value) => parsePhoneNumber(value, "BR").isValid()
				),

				//validando o cpf/cnpj com a biblioteca cpf-cnpj-validator
				customerDocument: Yup.string()
				.required()
				.test("is-valid-document", 
				"${path} is not a valid Document!", 
				(value) => cpf.isValid(value) || cnpj.isValid(value)
				),

				billingAddress: Yup.string().required(),
				billingNumber: Yup.string().required(),
				billingNeighborhood: Yup.string().required(),
				billingCity: Yup.string().required(),
				billingState: Yup.string().required(),
				billingZipCode: Yup.string().required(),

				//validação para verificar se o cartão é necessario

				creditCardNumber: Yup.string()
				.when("paymentType", (paymentType, schema) => paymentType === "credit_card" ? schema.required() : schema),
				creditCardExpiration: Yup.string()
				.when("paymentType", (paymentType, schema) => paymentType === "credit_card" ? schema.required() : schema),
				creditCardHolderName: Yup.string()
				.when("paymentType", (paymentType, schema) => paymentType === "credit_card" ? schema.required() : schema),
				creditCardCvv: Yup.string()
				.when("paymentType", (paymentType, schema) => paymentType === "credit_card" ? schema.required() : schema),

			});

			if(!(await schema.isValid(req.body))){

				return res.status(400).json({error: "error on validate schema"});

			}

			const cart = Cart.findOne({ code: cartCode});

			if (!cart) {
				return res.status(404).json({error: "cart not founded"});
			}

			//fazendo o registro da transação

			const service = new TransactionService();

			const resp = await service.process({
				cartCode,
				paymentType,
				installments,
				customer: {
					name: customerName,
					email: customerEmail,
					mobile: parsePhoneNumber(customerMobile, "BR").format("E.164"),
					document: customerDocument
				},
				billing: {
					address: billingAddress,
					number: billingNumber,
					neighborhood: billingNeighborhood,
					city: billingCity,
					state: billingState,
					zipcode: billingZipCode,

				},
				creditCard: {
					number: creditCardNumber,
					expiration: creditCardExpiration,
					holdername: creditCardHolderName,
					cvv: creditCardCvv
				}
			});

			return res.status(200).json(resp);


		} catch (err) {
			console.log(err);
			return res.status(418).json({error: "I'm a teapot"});
		}
	}
}

export default new TransactionsController();