import { ERR, ERRLOGIN, ISE } from "../../common/err.js"
import "@fastify/postgres"
import '@fastify/jwt'
import "@fastify/cookie"
export const sign = async (request, reply) => {
    const { username, password } = <any>request.body
    try {
        if (request.validationError) {
            return ERRLOGIN(request, reply)
        }
    } catch (err) {
        return ISE(request, reply)
    }
    try {
        if (!username || !password) {
            return ERR(request, reply)
        }
        else {
            try {
                const findUser = await request.server.pg.query("SELECT username,id,nameofsearch FROM users WHERE username=$1", [username])
                const [res] = await findUser.rows
                const { id } = await res
                const nameofsearch = await res.nameofsearch
                // const getToken = await request.cookies.token
                const token = await request.server.jwt.sign({ username, id, nameofsearch }, 'Stack', {
                    expiresIn: '1d'
                });
                // reply.clearCookie("token")
                reply.cookie("token", token, { httpOnly: true, secure: true, path: "/" })
                return reply.code(200).send({ "res": `${nameofsearch}`, "message": "log in finsh" })

            }
            catch (err) {
                console.error(err)
                return reply.code(400).send({ "mess": "have account go login" })
            }
        }
    } catch (err: any) {
        if (err.code === ' Fastify.errorCodes.FST_ERR_VALIDATION') {
            return ERRLOGIN(request, reply)
        }
        else {
            return ISE(request, reply)
        }
    }
}