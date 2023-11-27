const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function index(req, res) {
    const data = await prisma.post.findMany({
        include: {
            category: true
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
    });

    if (!data) {
        throw new Error("Not found");
    }

    return res.json(data);
}

async function store(req, res) {
    const datiInIngresso = req.body;

    // Genera lo slug dal titolo
    const slug = datiInIngresso.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\s-]/g, '');
    const newPost = await prisma.post.create({
        data: {
            title: datiInIngresso.title,
            image: datiInIngresso.image,
            slug: slug,
            content: datiInIngresso.content,
        }
    })

    return res.json(newPost);
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