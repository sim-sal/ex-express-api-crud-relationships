const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function index(req, res) {
    const tags = await prisma.tag.findMany();
    return res.json(tags);
}

async function store(req, res) {
    const datiInIngresso = req.body;

    // Genera lo slug dal nome
    let slug = datiInIngresso.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\s-]/g, '');

    // Verifica se lo slug è già presente nel database
    let existingSlug = await prisma.category.findUnique({
        where: {
            slug: slug,
        },
    });

    // Se lo slug esiste già, aggiungi un numero alla fine
    let counter = 1;
    while (existingSlug) {
        slug = `${slug}-${counter}`;
        counter++;

        // Verifica nuovamente se lo slug modificato esiste nel database
        existingSlug = await prisma.category.findUnique({
            where: {
                slug: slug,
            },
        });
    }

    // Lo slug è ora unico, si procede con la creazione del tag

    const newTag = await prisma.tag.create({
        data: {
            name: datiInIngresso.name,
            slug: slug
        },
        include: {
            posts: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    image: true,
                    content: true
                },
            },
        },
    })

    return res.json(newTag);
}

module.exports = {
    index,
    store
};