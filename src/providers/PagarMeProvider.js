
import {cpf} from "cpf-cnpj-validator";

import pagarme from "pagarme";

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
			card_holder_name: creditCard.holderName,
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
					zipcode: billing.zipcode.replace(/[^?0-9]/g, "")
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

		//criando os parametros da transação
		const transactionParams = {
			async: false,
			postback_url: process.env.PAGARME_WEBHOOK,
			...paymentParams,
			...customerParams,
			...billingParams,
			...itemsParams,
			...metadataParams
		}

		//faz a transação

		const client = await pagarme.client.connect({
			api_key: process.env.PAGARME_KEY
		});


		const response = await client.transactions.create(transactionParams);

		//guardando o retorno da transação

		return {
			transactionId: response.id,
			status: this.translateStatus(response.status),
			billet: {
				url: response.boleto_url,
				barcode: response.boleto_barcode
			},
			card: {
				id: response.card.id
			},
			processorResponse: JSON.stringify(response)

		}
	}

	translateStatus(status){

		const statusMap = {
		processing: "processing",
		waiting_payment: "pending",
		authorized: "pending",
		paid: "approved",
		refused: "refused",
		pending_refund: "refunded",
		refunded: "refunded",
		chargeback: "chargeback"
		}

		return statusMap[status];
	}
}


export default PagarMeProvider;