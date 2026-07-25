import { ISE,ERRSCHEMA } from "../../common/err.js"
import "@fastify/postgres"
import '@fastify/jwt'
export const create = async (request, reply) => {
    const { username, password, nameofsearch, uorc } = <any>request.body
    try {
        if (request.validationError) {
            return ERRSCHEMA(request, reply)
        }
    } catch (err) {
        return ISE(request, reply)
    }
    try {
        const a = await request.server.pg.query("INSERT INTO users(username,password,nameofsearch,userorsells) VALUES ($1,$2,$3,$4)", [username, password, nameofsearch, uorc])
        const idUserAfterCreate = await request.server.pg.query("SELECT id,username FROM users WHERE username=$1", [username])
        const [row] = await idUserAfterCreate.rows
        const id = await row.id
        const token = await request.server.jwt.sign({ nameofsearch, username, id },'Stack',{
            expiresIn:'1d'
        });
        reply.clearCookie("token")
        reply.setCookie('token', token,  { httpOnly: true, secure: true, path: "/", sameSite: 'none',maxAge: 30 * 24 * 60  })
        return reply.code(200).send({ "mes": "create account finsh" })

    } catch (err) {
        console.error(err)
        return reply.send({ "mess": "please go to login", username })
    }

}
