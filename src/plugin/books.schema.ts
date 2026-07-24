import fp from "fastify-plugin";
export default fp(async (fastify) => {
    fastify.addSchema({
        $id: "books",
        type: "object",
        required: ["name", "sell", "type", "discription"],
        properties: {
            name: {
                type: "string",
                minLength: 8
            },
            type: {
                type: "string",
                enum: ['Action','Drama', 'Comedy', 'Horror', 'Romance']
            },
            sell: {
                type: "string",
                enum: ['20', '40', '60', '80']
            },
            discription: {
                type: "string",
                minLength: 8
            }
        }
    }
    )
})

