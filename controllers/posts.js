const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult } = require("express-validator");
const ValidationError = require("../exceptions/ValidationError");

async function index(req, res) {
    const data = await prisma.post.findMany({
        include: {
            category: true,
            tags: true
        },
    });


    return res.json(data);
}

async function show(req, res) {
    const { slug } = req.params;

    const data = await prisma.post.findUnique({
        where: {
            slug: slug,
        },
        include: {
            category: true,
            tags: true
        }
    });

    if (!data) {
        throw new Error("Not found");
    }

    return res.json(data);
}

async function store(req, res, next) {

    const validation = validationResult(req);

    // isEmpty si riferisce all'array degli errori di validazione.
    // Se NON è vuoto, vuol dire che ci sono errori
    if (!validation.isEmpty()) {
        /* return res.status(400).json({
          message: "Controllare i dati inseriti",
          errors: validation.array(),
        }); */

        return next(
            new ValidationError("Controllare i dati inseriti", validation.array())
        );
    }

    const datiInIngresso = req.body;

    // Genera lo slug dal titolo
    let baseSlug = datiInIngresso.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\s-]/g, '');

    // Verifica se lo slug è già presente nel database
    let existingSlug = await slugExists(baseSlug);

    // Se lo slug esiste già, aggiungi un numero alla fine
    let counter = 1;
    let slug = baseSlug;
    while (existingSlug) {
        slug = `${baseSlug}-${counter}`;
        counter++;
        existingSlug = await slugExists(slug);
    }

    // Lo slug è ora unico, si procede con la creazione del post
    const newPost = await prisma.post.create({
        data: {
            title: datiInIngresso.title,
            image: datiInIngresso.image,
            slug: slug,
            content: datiInIngresso.content,
            tags: {
                connect: datiInIngresso.tags.map((idTags) => ({
                    id: +idTags,
                })),
            },
        },
        include: {
            category: true,
            tags: true
        },
    })

    return res.json(newPost);
}

async function slugExists(slug) {
    const existingSlug = await prisma.post.findUnique({
        where: {
            slug: slug,
        },
    });
    return existingSlug !== null;
}

async function update(req, res) {
    const slug = req.params.slug;
    const datiInIngresso = req.body;

    // controllo che quel post esista
    const post = await prisma.post.findUnique({
        where: {
            slug: slug,
        },
    });

    if (!post) {
        throw new Error('Post Not found');
    }

    const postAggiornato = await prisma.post.update({
        data: datiInIngresso,
        where: {
            slug: slug,
        },
    })

    return res.json(postAggiornato)
}

async function destroy(req, res) {
    await prisma.post.delete({
        where: {
            slug: req.params.slug,
        },
    });

    return res.json({ message: "post eliminato" });
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
};