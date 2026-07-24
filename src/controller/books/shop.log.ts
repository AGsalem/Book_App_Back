export const shopLog = async (request, reply) => {
    // دة صفحة الي هنبعت فيها كتب المستخدم  الي هيشوفها في صفحة/mybooks
    try {
        const Vtoken = await request.jwtVerify()
        const { id } = await Vtoken
        const knowSellerOrBuyer = await request.server.pg.query('SELECT userorsells FROM users WHERE id=$1', [id])
        const [rowK] = await knowSellerOrBuyer.rows
        const { userorsells } = rowK
        if (userorsells == 'seller&buyer') {
            const findBooks = await request.server.pg.query('SELECT name,sell,type,discription FROM books WHERE id_user = $1', [id])
            const [rowFB] = await findBooks.rows
            if (rowFB) {
                return reply.code(200).send({ "mes":"books completed","book": rowFB })
            }
            else {
                return reply.send({ "mess": "dont have any books" })
            }
        }
    } catch (err) {
        return reply.code(401).send({ "error": "please go login or sign up" })
    }
}