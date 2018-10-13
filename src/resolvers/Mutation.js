import uuidv4 from 'uuid/v4'

const Mutation = {
    createUser(parent, args, {db}, info) {
        const emailTaken = db.users.some((user) => user.email === args.data.email)

        if(emailTaken) {
            throw new Error('Email taken.')
        }

        const one = {
            name: 'Islamabad',
            country: 'Pakistan'
        }

        const two = {
            population: 1000000,
            ...one
        }

        const user = {
            id: uuidv4(),
            ...args.data
        }

        db.users.push(user)

        return user
    },
    deleteUser(parent, args, {db}, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id)

        if(userIndex === -1) {
            throw new Error('User not found.')
        }

        const deletedUsers = db.users.splice(userIndex, 1)

        //deleting user posts
        posts = db.posts.filter((post) => {
            const match = post.author === args.id

            if(match) {//deleting post comments
                comments = db.comments.filter((comment) => comment.post !== post.id)
            }

            return !match//keep the once that don't match
        })

        //deleting current user's comments
        comments = db.comments.filter((comment) => comment.author !== args.id)

        return deletedUsers[0]
    },
    updateUser(parent, args, {db}, info) {
        const user = db.users.find((user) => user.id === args.id)

        if(!user) {
            throw new Error('No user found.')
        }

        if(typeof args.data.email === 'string') {
            //check that no other user is using the new email address
            const emailTaken = db.users.some((user) => user.email === args.data.email)

            if(emailTaken) {
                throw new Error('Email taken')
            }
            user.email = args.data.email
        }

        if(typeof args.data.name === 'string') {
            user.name = args.data.name
        }

        if(typeof args.data.age !== 'undefined') {
            user.age = args.data.age
        }

        return user
    },
    createPost(parent, args, {db,pubsub}, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)

        if(!userExists) {
            throw new Error('User not found.')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)
        if(post.published) {
            pubsub.publish('post_channel', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }

        return post
    },
    deletePost(parent, args, {db}, info) {
        const postToRemove = db.posts.find((post) => post.id === args.id)

        //remove this post from posts
        posts = db.posts.filter((post) => post.id !== postToRemove.id)

        //remove the post comments
        comments = db.comments.filter((comment) => comment.post !== postToRemove.id)

        if(postToRemove.published) {
            pubsub.publish('post_channel', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }

        return postToRemove
    },
    updatePost(parent, args, {db}, info) {
        const post = db.posts.find((post) => post.id === args.id)
        const originalPost = post
        if(!post) {
            throw new Error('Post not found.')
        }

        args = args.data

        if(typeof args.title === 'string') {
            post.title = args.titles
        }

        if(typeof args.description === 'string') {
            post.description = args.description
        }

        if(typeof args.published !== 'boolean') {
            post.published = args.published

            if(originalPost.published && !post.published) {
                pubsub.publish('post_channel', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if(!originalPost.published && post.published) {
                pubsub.publish('post_channel', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            } else if(post.published) {
                pubsub.publish('post_channel', {
                    post: {
                        mutation: 'UPDATED',
                        data: post
                    }
                })
            }
        }

        return post
    },
    createComment(parent, args, {db, pubsub}, info) {
        const postExist = db.posts.some((post) => post.id === args.data.post)

        const userExist = db.users.some((user) => user.id === args.data.author)

        if(!(postExist && userExist)) {
            throw new Error('Invalid author or Post')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment)
        pubsub.publish(`comment_channel_${args.data.post}`, {comment})

        return comment
    },
    deleteComment(parent, args, {db}, info) {
        const commentToRemove = db.comments.find((comment) => comment.id === args.id)

        comments = db.comments.filter((comment) => comment.id !== commentToRemove.id)

        return commentToRemove
    },
    updateComment(parent, args, {db}, info) {
        const comment = comments.find((comment) => comment.id === args.id)

        if(!comment) {
            throw new Error('Comment not found.')
        }
        
        args = args.data

        if(typeof comment === 'string') {
            comment.text = args.text
        }

        return comment
    }
}

export {Mutation as default}