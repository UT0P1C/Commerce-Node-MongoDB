
import {cpf} from "cpf-cnpj-validator";

class PagarMeProvider {
	async process({
		transactionCode,
		total,
		paymentType,
		installments,
		creditCard,
		customer,
		billing,
		items
	}){


		//formas de pagamento

		//boleto

		const billetParams = {
			payment_method: "boleto",
			amount: total * 100,
			installments: 1
		}

		//cartao de credito

		const creditCardParams = {
			payment_method: "credit_card",
			amount: total * 100,
			installments,
			card_number: creditCard.number.replace(/[^?0-9]/g, ""),
			card_expiration_date: creditCard.expiration.replace(/[^?0-9]/g, ""),
			card_cvv: creditCard.cvv,
			capture: true
		}

		let paymentParams;

		//definir a forma de pagamento

		switch (paymentType) {
			case "credit_card":
				paymentParams = creditCardParams;
				break;
			case "billet":
				paymentParams = billetParams;
				break;
		
			default:
				throw `paymentType ${paymentType} not found`;
		}

		//dados do comprador

		const customerParams = {
			customer: {
				external_id: customer.email,
				name: customer.name,
				email: customer.email,
				type: cpf.isValid(customer.document) ? "individual" : "corporation",
				country: "br",
				phone_numbers: [customer.mobile],
				documents: {
					type: cpf.isValid(customer.document) ? "cpf" : "cnpj",
					number: customer.document.replace(/[^?0-9]/g, "")
				}
			}
		}

		//dados de recebimento

		const billingParams = billing?.zipcode ? {
			billing: {
				name: "billing address",
				address: {
					country: "br",
					state: billing.state,
					city: billing.city,
					neighborhood: billing.neighborhood,
					street: billing.address,
					street_number: billing.number,
					zipcode: billing.zipcode
				}
			}
		} : {}

		//itens do carrinho

		const itemsParams = items && items.length > 0 ? {
			items: items.map((item) => ({
				id: item?.id.toString(),
				title: item?.title,
				unit_price: item?.amount * 100,
				quantity: item?.quantity || 1,
				tangible: false
			}))
		} : {
			items: [
				{
				id: "1",
				title: `t-${transactionCode}`,
				unit_price: total * 100,
				quantity: 1,
				tangible: false
				}
			]
		}

		// coisas adicionais

		const metadataParams = {
			metadata: {
				transaction_id: transactionCode
			}
		}

		//criando a transação
		const transactionParams = {
			async: false,
			//postback_url: "",
			...paymentParams,
			...customerParams,
			...billingParams,
			...itemsParams,
			...metadataParams
		}
		
		console.debug("transactionParams", transactionParams);

	}

}


export default PagarMeProvider;