import fp from 'fastify-plugin'
import { a } from '../common/var.js'
export default fp(fa => {
    fa.register(import("@fastify/jwt"), {
        secret:`${a}`,
        cookie: {
            cookieName: 'token',
            signed: false
        }
    }) ;

})