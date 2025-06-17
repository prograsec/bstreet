import {Category} from "@/payload-types";

export type CustomCategory = Category & {
    subcategories: Category[];
}

//'export' This keyword makes the type available to other files that want to import it.
// 'type' This keyword defines a new type called CustomCategory.
// 'CustomCategory' This is the name of the new type.
// 'Category' This is the base type that CustomCategory extends.
// '&' This operator is used to extend the Category type, meaning CustomCategory will have all properties of Category.
// 'subcategories?: Category[]' This is an optional property that can hold an array of Category objects. The '?' indicates that this property is optional, meaning it may or may not be present in an object of type CustomCategory.
// 'export type CustomCategory' This line exports the CustomCategory type so it can be used in other files.