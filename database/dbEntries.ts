import {isValidObjectId} from "mongoose";
import {db} from './';
import {Entry, IEntry} from "../models";

export const getEntryById = async (id: string): Promise<IEntry | null> => {
    if (!isValidObjectId(id)) return null;

    await db.connect();
    const entry = await Entry.findById(id).lean(); // .lean() <--- traer info mínima
    await db.disconnect();

    return entry;
    // return JSON.parse(JSON.stringify(entry)); // solución al problema de serialización del _id de mongo
}