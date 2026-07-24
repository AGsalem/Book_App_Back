import fastify from "fastify";
import connection from "./connection.js";
import 'dotenv/config';

const app = fastify({
    logger: true
});

// تسجيل الاتصال
await app.register(connection);

app.ready(() => {
    console.log(app.printRoutes());
});

// هذا السطر مهم جداً لـ Vercel ليتمكن من تشغيل الفاستيفاي كدالة
export default async function handler(req: any, res: any) {
    await app.ready();
    app.server.emit('request', req, res);
}

// تشغيل listen فقط لو المشروع يعمل محلياً وليس على Vercel
if (process.env.NODE_ENV !== 'production') {
    const port: number = Number(process.env.PORT || 5000);
    try {
        await app.listen({ port: port, host: "0.0.0.0" });
        console.log(`Port running on ${port}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}