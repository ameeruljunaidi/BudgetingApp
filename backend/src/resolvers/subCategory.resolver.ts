import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import SubCategoryService from "../service/subCategory.service";
import SubCategory from "../schema/subCategory.schema";
import SubCategoryInput from "../schema/subCategory/subCategory.input";

@Resolver()
export default class SubCategoryResolver {
    constructor(private subCategoryService: SubCategoryService) {
        this.subCategoryService = new SubCategoryService();
    }

    @Authorized("admin", "user")
    @Mutation(() => SubCategory)
    addSubCategory(@Arg("input") input: SubCategoryInput) {
        return this.subCategoryService.addSubCategory(input);
    }

    @Authorized("admin", "user")
    @Mutation(() => SubCategory)
    removeSubCategory(@Arg("input") input: SubCategoryInput) {
        return this.subCategoryService.removeSubCategory(input);
    }

    @Authorized("admin", "user")
    @Mutation(() => SubCategory)
    updateSubCategory(@Arg("input") input: SubCategoryInput) {
        return this.subCategoryService.updateSubCategory(input);
    }
}
