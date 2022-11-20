interface SeedData {
    entries: SeedEntry[];
}

interface SeedEntry {
    description: string;
    status: string;
    createdAt: number;
}

export const seedData: SeedData = {
    entries: [
        {
            description:
                'Pendientes: Adipisicing commodo ea minim anim dolore.',
            status: 'pending',
            createdAt: Date.now(),
        },
        {
            description:
                'En Progreso: Minim ad laborum dolore deserunt aute dolor anim id.',
            status: 'in-progress',
            createdAt: Date.now() - 1000000,
        },
        {
            description:
                'Terminadas: Sit officia velit do et do reprehenderit officia nostrud aliqua ut eiusmod ad cupidatat et.',
            status: 'finished',
            createdAt: Date.now() - 100000,
        },
    ],
};
