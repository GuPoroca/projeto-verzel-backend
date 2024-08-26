export default function fallbackMiddleware(error, request, response, next){
    console.error(error.stack);

    const statusCode = error.statusCode || 500;

    response.status(statusCode).send({ message: error.message});
}