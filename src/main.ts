import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

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

    await app.listen(process.env.URL)
}
bootstrap()
