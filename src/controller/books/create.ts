import { ISE, ERRLOGIN } from '../../common/err.js';
export const createBook = async (request, reply: any) => {
    try {

        const coo = request.cookies.token
        const Vtoken = await request.jwtVerify()
        const { name, sell, type, discription } = request.body as any;
        const book = await request.server.jwt.sign({ name, sell, type, discription })
        return reply.cookie("book", book, { httpOnly: true, secure: true, path: "/", sameSite: 'none',maxAge: 30 * 24 * 60  }).send({ "res": "Create Book finsh", name, sell, type, discription }, 'Stack', {
            expiresIn: '1d'
        });
    } catch (err: any) {
        return ISE(request, reply)
    }
}
