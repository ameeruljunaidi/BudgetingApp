import CategoryInput from "../schema/category/category.input";
import Category, { CategoryModel } from "../schema/category.schema";
import { GraphQLError } from "graphql";
import SubCategory from "../schema/subCategory.schema";
import User, { UserModel } from "../schema/user.schema";
import { Error } from "mongoose";

export default class CategoryService {
    async addCategory(input: CategoryInput, user: User): Promise<Category> {
        const returnedUser = await UserModel.findById(user._id).lean();
        if (!returnedUser) throw new GraphQLError("Cannot find user");

        const returnedCategory = await CategoryModel.create(input);
        if (!returnedCategory) throw new GraphQLError("Failed to add category to DB");

        const updatedUser = { ...returnedUser, categories: returnedUser.categories.concat(returnedCategory._id) };
        const returnedUpdatedUser = await UserModel.findByIdAndUpdate(updatedUser._id, updatedUser, { new: true });

        if (!returnedUpdatedUser) {
            await CategoryModel.findByIdAndDelete(returnedCategory._id);
            throw new GraphQLError("Failed to update user with new category");
        }

        return returnedCategory;
    }

    async removeCategory(input: CategoryInput, user: User): Promise<Category> {
        const returnedUser = await UserModel.findById(user._id).lean();
        if (!returnedUser) throw new GraphQLError("Cannot find user");

        const returnedCategory = await CategoryModel.findOne(input);
        if (!returnedCategory) throw new GraphQLError("Failed to find category.");

        const updatedUser = {
            ...returnedUser,
            categories: returnedUser.categories.filter((category) => category !== returnedCategory._id),
        };
        const returnedUpdatedUser = await UserModel.findByIdAndUpdate(updatedUser._id, updatedUser, { new: true });

        if (!returnedUpdatedUser) {
            await CategoryModel.findByIdAndDelete(returnedCategory._id);
            throw new GraphQLError("Failed to update user with removed category");
        }

        try {
            await returnedCategory.deleteOne();
        } catch (e) {
            if (e instanceof Error) throw new GraphQLError(e.message);
            else throw new GraphQLError("Cannot delete category");
        }
        return returnedCategory;
    }

    async updateCategory(input: CategoryInput): Promise<Category> {
        const returnedCategory = await CategoryModel.findOneAndUpdate(input, input, { new: true });
        if (!returnedCategory) throw new GraphQLError("Cannot find category");
        return returnedCategory;
    }

    async getSubCategories(input: CategoryInput): Promise<SubCategory[] | null> {
        const returnedCategory = (await CategoryModel.findOne(input).populate("subCategories")) as Category;
        if (!returnedCategory) throw new GraphQLError("Category does not exist in the database");

        return returnedCategory.subCategories as SubCategory[];
    }
}
