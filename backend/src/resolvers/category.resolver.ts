import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import CategoryService from "../service/category.service";
import Category from "../schema/category.schema";
import CategoryInput from "../schema/category/category.input";
import Context from "../types/context";
import SubCategory from "../schema/subCategory.schema";

@Resolver()
export default class CategoryResolver {
    constructor(private categoryService: CategoryService) {
        this.categoryService = new CategoryService();
    }

    @Authorized("admin", "user")
    @Mutation(() => Category)
    addCategory(@Arg("input") input: CategoryInput, @Ctx() context: Context) {
        const user = context.user;
        return this.categoryService.addCategory(input, user!);
    }

    @Authorized("admin", "user")
    @Mutation(() => Category)
    removeCategory(@Arg("input") input: CategoryInput, @Ctx() context: Context) {
        const user = context.user;
        return this.categoryService.removeCategory(input, user!);
    }

    @Authorized("admin", "user")
    @Mutation(() => Category)
    updateCategory(@Arg("input") input: CategoryInput) {
        return this.categoryService.updateCategory(input);
    }

    @Authorized("admin", "user")
    @Query(() => [SubCategory])
    getSubCategories(@Arg("input") input: CategoryInput) {
        return this.categoryService.getSubCategories(input);
    }
}
