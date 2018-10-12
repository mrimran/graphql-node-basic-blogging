const Query = {
    me() {
        return {
            id: 'abc123',
            name: 'Imran',
            email: 'imran@zeropoint.it'
        }
    },
    post() {
        return {
            id: 'abc112',
            title: 'Testing post title',
            body: 'Testing post body',
            published: true
        }
    },
    users(parent, args, {db}, info) {
        if(!args.query) {
            return db.users
        }

        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    posts(parent, args, {db}, info) {
        if(!args.query) {
            return db.posts
        }

        return db.posts.filter((post) => {
            return post.title.toLocaleLowerCase().includes(args.query.toLowerCase()) || post.body.includes(args.query.toLowerCase())
        })
    },
    comments(parent, args, {db}, info) {
        return db.comments
    }
}

export {Query as default}