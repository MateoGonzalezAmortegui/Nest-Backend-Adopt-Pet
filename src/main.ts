import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { IncomingMessage, ServerResponse } from 'http'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    app.enableCors()

    const config = new DocumentBuilder()
        .setTitle('Adopt Pets')
        .setDescription(
            'API REST for the app of adoption pet made the 15/12/2023 for Mateo Gonzalez Amortegui Ing.Telecomunication, he from Bogota, Colombia',
        )
        .setVersion('1.0')
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)

    await app.init()
    return app
}

let cachedServer

export default async function handler(
    req: IncomingMessage,
    res: ServerResponse,
) {
    if (!cachedServer) {
        const app = await bootstrap()
        cachedServer = app.getHttpAdapter().getInstance()
    }
    cachedServer(req, res)
}

// Iniciar la aplicación localmente si no se está ejecutando en Vercel
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.URL
    bootstrap()
        .then((app) => {
            app.listen(port, () => {
                console.log(
                    `Application is running on: http://localhost:${port}`,
                )
            })
        })
        .catch((err) => console.error('Error starting server', err))
}
