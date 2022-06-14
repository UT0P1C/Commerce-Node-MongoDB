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


		

	}

}


export default PagarMeProvider;