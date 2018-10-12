// Named export
const message = 'some message from myModule.js'

const location = 'Islamabad'//default export

const getGreeting = (name) => {
    return `welcome to the course ${name}`
}

export {message, getGreeting, location as default}