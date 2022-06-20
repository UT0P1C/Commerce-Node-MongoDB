# Commerce-Node-MongoDB

E-commerce utilizando Node com a API do Pagar.me e MongoDB como banco de dados

Bibliotecas Node utilizadas: 

Express,
Dotenv,
Mongoose,
Cors,
pagarme,
cpf-cnpj-validator,
libphonenumber-js,
uuid,
yup,
Nodemon e Sucrase como dependencias de desenvolvimento

# Como utilizar

para utilizar e testar basta adicionar os parametros necessários em um arquivo .env (pode consultar os parametros no arquivo .env.example)


# Exemplo de requisição

{
    "cartCode": "666",
    "paymentType": "credit_card",
    "installments": 1,
    "customerName": "",
    "customerEmail": "",
    "customerMobile": "",
    "customerDocument": "",
    "billingAddress": "",
    "billingNumber": "",
    "billingNeighborhood": "",
    "billingCity": "",
    "billingState": "",
    "billingZipCode": "",
    "creditCardNumber": "",
    "creditCardExpiration": "",
    "creditCardHolderName": "",
    "creditCardCvv": ""
}
