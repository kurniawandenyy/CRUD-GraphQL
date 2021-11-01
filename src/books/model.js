const bookModel = (sequelize, Sequelize) => {
    const book = sequelize.define("book", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: Sequelize.STRING },
        authorId: { type: Sequelize.INTEGER }
    })

    return book
}

export default bookModel