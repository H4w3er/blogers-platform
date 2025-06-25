import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersAccountsModule } from './modules/user-accounts/users-accounts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsPostsCommentsModule } from './modules/blogs-posts-comments/blogs-posts-comments.module';
import { TestingModule } from './modules/testing/testing.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb+srv://artem:admin@data.xluig.mongodb.net/dev?retryWrites=true&w=majority&appName=Data`), // Укажите свой URL MongoDB
    UsersAccountsModule,
    BlogsPostsCommentsModule,
    TestingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}