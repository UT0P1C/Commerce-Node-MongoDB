import Transaction from "../models/Transaction";
import TransactionService from "../services/TransactionService";

class PostbackController {
	async pagarme(req,res) {
		const {id, object, current_status} = req.body;

		try {
			if(object === "transaction"){
				const transaction = await Transaction.findOne({transactionId: id});
				if(!transaction){
					return res.status(404).json();
				}
			}

			const service = new TransactionService();
			await service.updateStatus({
				code: transaction.code, 
				providerStatus: current_status
			});

			return res.status(200).json();

		} catch (err) {
			return res.status(418).json({message: "I'm a teapot"});
		}
	}
}

export default new PostbackController();