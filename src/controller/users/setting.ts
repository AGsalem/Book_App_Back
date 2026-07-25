import { ISE } from "../../common/err.js"
export const setting = async (request, reply) => {
    try {
        await request.cookies.token
        const Vtoken = await request.jwtVerify()
        const sname = await Vtoken.nameofsearch
        const name = await Vtoken.username
        return reply.send({ "mes": `${name}` })
    } catch (err: any) {
        return reply.send({ "error": " page not found" })
    }
}