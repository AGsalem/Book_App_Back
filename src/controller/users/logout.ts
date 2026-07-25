import { ISE } from "../../common/err.js"
export const logout = async (request, reply) => {
    try {
        reply.clearCookie("token", { httpOnly: true, secure: true, path: "/", sameSite: 'none',maxAge: 30 * 24 * 60  })
        return reply.code(200).send({"message":"logout finsh"})
    } catch (err:any) {
        return ISE(request, reply)
    }
}