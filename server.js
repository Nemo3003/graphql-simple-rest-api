// server.js
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import productsData from './dataMock.js'; 

let counter = productsData.length + 1;

const schema = buildSchema(`
    type Product { 
        id: ID!
        name: String!
        price: Float!
        description: String!
        category: String!
        image: String!
    }
    type Query {
        products: [Product]
        product(id: ID!): Product
    }
    type Mutation {
        addProduct(name: String!, price: Float!, description: String!, category: String!, image: String!): Product
    }
`
);

let root = {
    products: () => productsData, // Use imported JSON data

    product: ({ id }) => productsData.find(product => product.id == id),

    addProduct: (data) => {
        let newProduct = {
            id: counter,
            ...data,
        };
        productsData.push(newProduct);
        counter++;
        return newProduct;
    },
}

const app = express();

// Add a route for the /products URL that returns products as JSON
app.get('/products', (req, res) => {
    res.json(productsData);
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql');
});