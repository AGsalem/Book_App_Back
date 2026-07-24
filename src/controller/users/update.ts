import { ISE, ERRLOGIN } from "../../common/err.js"
export const update = async (request, reply) => {
    try {
        const { username, password } = request.body as any
        try {
            if (request.validationError) {
                return ERRLOGIN(request, reply)
            }
        } catch (err) {
            return ISE(request, reply)
        }
        const retoken = await request.jwtVerify()
        const vname = await retoken.username
        const id = await retoken.id
        const findnameofsearch = await request.server.pg.query("SELECT nameofsearch FROM users WHERE id=$1 ", [id])
        const [row] = await findnameofsearch.rows
        const nameofsearch = await row.nameofsearch
        const updateUser = await request.server.pg.query("UPDATE users SET username=$1 , password=$2 WHERE id=$3", [username, password, id])
        const token = await request.server.jwt.sign({ username, id, nameofsearch }, 'Stack', {
            expiresIn: '1d'
        })
        reply.clearCookie("token")
        reply.cookie("token", token, { httpOnly: true, secure: true, path: "/" })
        return reply.send({ "mes": nameofsearch })
    }
    catch (err: any) {
        if (err.code === ' Fastify.errorCodes.FST_ERR_VALIDATION') {
            return ERRLOGIN(request, reply)
        }
        console.error(err)
        return ISE(request, reply)
    }
}