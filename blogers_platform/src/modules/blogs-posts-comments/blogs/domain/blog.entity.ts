import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Error, HydratedDocument, Model} from 'mongoose';
import { CreateBlogDomainDto } from './dto/create-blog.domain.dto';


@Schema({ timestamps: true })
export class Blog {

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true})
  websiteUrl: string;

  @Prop({ type: Boolean, required: true})
  isMembership: boolean;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  static createInstance(dto: CreateBlogDomainDto): BlogDocument {
    const blog = new this();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.isMembership = true;

    blog.deletedAt = null;
    return blog as BlogDocument;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

//регистрирует методы сущности в схеме
BlogSchema.loadClass(Blog);

//Типизация документа
export type BlogDocument = HydratedDocument<Blog>;

//Типизация модели + статические методы
export type BlogModelType = Model<BlogDocument> & typeof Blog;