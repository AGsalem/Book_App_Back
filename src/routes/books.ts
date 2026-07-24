import { FastifyPluginAsync } from 'fastify';
import { createBook } from '../controller/books/create.js';
import { addBook } from '../controller/books/addBook.js';
import { shopLog } from '../controller/books/shop.log.js';
const books: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.post("/new", {
        schema: {
            body: { $ref: "books#" }
        }
    }, createBook)
    fastify.post("/addBook",addBook)
    fastify.get('/mybooks',shopLog)
};
export default books
