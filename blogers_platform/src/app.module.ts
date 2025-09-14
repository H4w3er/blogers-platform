import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersAccountsModule } from './modules/user-accounts/users-accounts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsPostsCommentsModule } from './modules/blogs-posts-comments/blogs-posts-comments.module';
import { TestingModule } from './modules/testing/testing.module';
import * as process from 'node:process';
import { configModule } from './config-dynamic-module';

@Module({
  imports: [
    configModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL ?? 'mongodb+srv://artem:admin@data.xluig.mongodb.net/dev?retryWrites=true&w=majority&appName=Data'),
    UsersAccountsModule,
    BlogsPostsCommentsModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}