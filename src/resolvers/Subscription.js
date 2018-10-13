const Subscription = {
    count: {
        subscribe(parent, args, {pubsub}, info) {
            let count = 0

            setInterval(() => {
                count++
                pubsub.publish('countChannel', {
                    count
                })
            }, 1000)

            return pubsub.asyncIterator('countChannel')
        }
    },
    newPost: {
        subscribe(parent, args, {pubsub}, info) {
            return pubsub.asyncIterator('post_channel')
        }
    },
    comment: {
        subscribe(parent, args, {db, pubsub}, info) {
            const postId = args.postId

            const post = db.posts.find((post) => post.id === postId && post.published)

            if(!post) {
                throw new Error('Post not found.')
            }

            return pubsub.asyncIterator(`comment_channel_${postId}`)
        }
    }
}

export {Subscription as default}