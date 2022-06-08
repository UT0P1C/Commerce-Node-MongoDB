import Cart from "../models/Cart";

class CartsController {
	async index (req, res) {
		//get cart
		try {
			const carts = await Cart.find();
			return res.status(200).json(carts);
		} 
		catch (err) {
			console.log(err);
			return res.status(418).json({message: "i'm a teapot"});
		}
	}

	//create cart post

	async create(req, res) {
		try {
			const {code, price} = req.body;

			const cart = await Cart.create({code, price});

			return res.status(201).json(cart);
		} 
		catch (err) {
			console.log(err);
			return res.status(418).json({message: "I'm a teapot"});
		}
	}


	//update cart put

	async update(req, res) {
		try {
			
			const { id } = req.params;

			const {code, price} = req.body;

			const cart = await Cart.findById(id);

			if(!cart){
				return res.status(404).json({message: "Error: Product not found"});
			}

			await Cart.updateOne({code, price});

			return res.status(200).json({message: "Product updated successfully"});


		} 
		catch (err) {
			console.log(err);
			return res.status(418).json({message: "I'm a teapot"});
		}
	}

	//Delete cart 

	async delete(req, res) {
		try {
			const {id} = req.params;

			const cart = await Cart.findById(id);

			if(!cart){
				return res.status(404).json({message: "Error: Product not found"});
			}

			await cart.deleteOne();

			return res.status(200).json({message: "Product updated successfully"});
			
		}
		catch (err) {
			console.log(err);
			return res.status(418).json({message: "I'm a teapot"});
		}
	}
}




export default new CartsController();