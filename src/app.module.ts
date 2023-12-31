import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { PetsModule } from './pets/pets.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { AuthModule } from './auth/auth.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGO_URL),
        UsersModule,
        PetsModule,
        CloudinaryModule,
        AuthModule,
    ],
})
export class AppModule {}
