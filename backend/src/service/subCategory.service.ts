import SubCategoryInput from "../schema/subCategory/subCategory.input";
import SubCategory, { SubCategoryModel } from "../schema/subCategory.schema";
import Category, { CategoryModel } from "../schema/category.schema";
import { GraphQLError } from "graphql";

export default class SubCategoryService {
    async addSubCategory(input: SubCategoryInput): Promise<SubCategory> {
        const returnedCategory = (await CategoryModel.findOne({ name: input.parentCategory }).lean()) as Category;
        if (!returnedCategory) throw new GraphQLError("Cannot find parent category");

        const returnedSubCategory = await SubCategoryModel.create({ ...input, parentCategory: returnedCategory._id });
        if (!returnedSubCategory) throw new GraphQLError("Failed to add sub-category");

        const updatedCategory: Category = {
            ...returnedCategory,
            subCategories: returnedCategory.subCategories.concat(returnedSubCategory._id),
        };

        const returnedUpdatedCategory = await CategoryModel.findByIdAndUpdate(updatedCategory._id, updatedCategory, {
            new: true,
        });
        if (!returnedUpdatedCategory) {
            await SubCategoryModel.findByIdAndDelete(returnedSubCategory._id);
            throw new GraphQLError("Failed to update category");
        }

        return returnedSubCategory;
    }

    async removeSubCategory(input: SubCategoryInput): Promise<SubCategory> {
        const returnedCategory = (await CategoryModel.findOne({ name: input.parentCategory }).lean()) as Category;
        if (!returnedCategory) throw new GraphQLError("Cannot find parent category");

        const returnedSubCategory = await SubCategoryModel.findOne(input);
        if (!returnedSubCategory) throw new GraphQLError("Cannot find sub-category in DB");

        const updatedCategory: Category = {
            ...returnedCategory,
            subCategories: returnedCategory.subCategories.filter((category) => category !== returnedSubCategory._id),
        };

        const returnedUpdatedCategory = await CategoryModel.findByIdAndUpdate(updatedCategory._id, updatedCategory, {
            new: true,
        });
        if (!returnedUpdatedCategory) {
            await SubCategoryModel.findByIdAndDelete(returnedSubCategory._id);
            throw new GraphQLError("Failed to update category");
        }

        try {
            await SubCategoryModel.findOneAndDelete(input);
        } catch (e) {
            if (e instanceof Error) throw new GraphQLError(e.message);
            else throw new GraphQLError("Cannot update category");
        }

        return returnedSubCategory;
    }

    async updateSubCategory(input: any) {
        const returnedSubCategory = await CategoryModel.findOneAndUpdate(input, input, { new: true });
        if (!returnedSubCategory) throw new GraphQLError("Cannot find sub-category");
        return returnedSubCategory;
    }
}
