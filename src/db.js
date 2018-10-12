let users = [
    {
        id: 'abc123',
        name: 'Imran',
        email: 'imran@zeropoint.it',
        age: 30
    },
    {
        id: 'abc124',
        name: 'Usman',
        email: 'usman@example.com'
    }
]

let posts = [
    {
        id: 'post1',
        title: 'Post title 1',
        body: 'Post desc 1',
        published: true,
        author: 'abc123'
    },
    {
        id: 'post2',
        title: 'Post title 2',
        body: 'Post desc 2',
        published: true,
        author: 'abc124'
    },
]

let comments = [
    {
        id: 'com1',
        text: 'Testing comment 1',
        author: 'abc123',
        post: 'post1'
    },
    {
        id: 'com2',
        text: 'Another comment 2',
        author: 'abc123',
        post: 'post2'
    },
    {
        id: 'com3',
        text: 'Just another comment 3',
        author: 'abc124',
        post: 'post2'
    }
]

const db = {
    users,
    posts,
    comments
}

export {db as default}