import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import path from "node:path"
import jwt from 'jsonwebtoken';
import { a } from '../../common/var.js';
import { pipeline } from "node:stream/promises";
import fs from 'fs';
import { ISE } from '../../common/err.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const addBook = async (request, reply) => {
    try {
        const file = await request.file()
        if (file.mimetype !== 'application/pdf') {
            return reply.code(402).send({ "errvaldata": 'err please input file *.pdf' })
        }
        else if (!file) {
            return {"errF":'no such as file'}
        }
        else {
            const rebook = await request.cookies.book
            const Vtoken = await request.jwtVerify()
            const Vbook = await jwt.verify(rebook, a)
            // دلوقتي نبدا نحط الداتا بجد الكاملة وبعديها نحذف توكن الكتاب وlocal storageمن الفرونت
            // اولا من توكن المستخدم خدidالمستخدم بس
            const { id } = Vtoken
            // فك الاربعة الي هيجولك من الكتاب المتخزن في الكوكيز مش اسم الكتاب
            const { name } = await Vbook
            const { sell } = await Vbook
            const { type } = await Vbook
            const { discription } = await Vbook
            const finsh = file.filename
             const addNewbook = await request.server.pg.query("INSERT INTO books(id_user,name,sell,type,discription,filename ) VALUES($1,$2,$3,$4,$5,$6);", [id,name,sell,type,discription,finsh])
            const save = await path.join(__dirname, '../../upload', finsh)
            await pipeline(file.file, fs.createWriteStream(save))
            return reply.code(201).clearCookie('book', { httpOnly: true, secure: true, path: '/' }).send({ "message": "add file finsh" })
        }
    } catch (err: any) {
        if (err.code === 'FST_INVALID_MULTIPART_CONTENT_TYPE') {
            return reply.code(401).send({ "err": "please input file pdf" })
        }
        console.error(err)
        return ISE(request, reply)
    }

}