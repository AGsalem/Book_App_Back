import { ISE } from "../common/err.js"
import { users, book, buy } from "../common/sql.js"
export const admin = async (request, reply) => {
    try {
        const { id, name, pass } = <any>request.body
        if (!id || !name || !pass) {
            console.log(id, pass, name)
            return reply.code(400).send({ "ban": "ban" })
        }
        //     // تعريف الي جي من الداش بورد
        const findad = await request.server.pg.query('SELECT * FROM admin WHERE id=$1 AND admin_name=$2 AND admin_pass=$3', [id, name, pass])
        if (findad.rows.length === 0) {
            return reply.code(401).send({ "ban": "ban" })
        }
        else {
            const alldata = await users(request, reply)
            // كل الكتب
            const books = await book(request, reply)
            // المبيعات
            const buyrs = await buy(request, reply)
            return reply.code(200).send({
                "welcom": "Welcom Admin",
                "AllUsers": alldata,
                "AllBook": books,
                "AllBuy": buyrs
            })
        }

    } catch (err) {
        console.error(err)
        return ISE(request, reply)
    }
}

