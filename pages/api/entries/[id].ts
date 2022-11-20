import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { db } from '../../../database';
import { Entry, IEntry } from '../../../models';

type Data = { message: string } | IEntry;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { id } = req.query;

    // Si no es un id válido de mongo
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: `El id ${id} no es válido` });
    }

    switch (req.method) {
        case 'PUT':
            return updatedEntry(req, res);
        case 'GET':
            return getEntry(req, res);
        case 'DELETE':
            return deleteEntry(req, res);
        default:
            return res
                .status(500)
                .json({ message: `Algo salió mal, método ${req.method} no existe` });
    }
}

// Actualizar una entrada por su ID
const updatedEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;
    await db.connect();

    const entryToUpdate = await Entry.findById(id);

    if (!entryToUpdate) {
        await db.disconnect();
        return res.status(400).json({ message: `No hay entrada con ese ID ${id}` });
    }

    // Si no viene la descripción ni el status, usamos la que está en BD
    const { description = entryToUpdate.description, status = entryToUpdate.status } = req.body;

    try {
        const updatedEntry = await Entry.findByIdAndUpdate(
            id,
            { description, status },
            { runValidators: true, new: true }
        );

        // entryToUpdate.description = description;
        // entryToUpdate.status = status;
        // await entryToUpdate.save();

        await db.disconnect();

        // Siempre voy a tener un respuesta (!) porque ya lo revisamos
        res.status(200).json(updatedEntry!);
    } catch (error: any) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({ message: error.errors.status.message });
    }
};

// Obtener entrada por su ID
const getEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;

    await db.connect();
    const entryInDB = await Entry.findById(id);
    await db.disconnect();

    if (!entryInDB) {
        return res.status(400).json({ message: `No hay entrada con ese ID ${id}` });
    }

    res.status(200).json(entryInDB);
};

// Eliminar entrada por ID
const deleteEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;

    await db.connect();
    const entryDBToDelete = await Entry.findByIdAndDelete( id );
    await db.disconnect();

    if ( !entryDBToDelete ) {
        return res.status(400).json({message: 'No hay entrada con ese id ' + id });
    }

    res.status(200).json( entryDBToDelete );
}