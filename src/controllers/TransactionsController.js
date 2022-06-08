
import * as Yup from "yup";

import parsePhoneNumber from "libphonenumber-js";

import {cpf, cnpj} from "cpf-cnpj-validator";

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


				

			});

			if(!(await schema.isValid(req.body))){

				return res.status(400).json({error: "error on validate schema"});

			}

			return res.status(200).json({message: "ok!"});
		} catch (err) {
			console.log(err);
			return res.status(418).json({error: "I'm a teapot"});
		}
	}
}

export default new TransactionsController();