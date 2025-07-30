import { inferRouterOutputs } from "@trpc/server";
import type {AppRouter} from '@/trpc/routers/_app';

export type ProductsGetManyOutput = inferRouterOutputs<AppRouter>['products']['getMany'];

//ProductsGetManyOutput is the type of the data that will be returned from the getMany function
//inferRouterOutputs is a function that infers the type of the data that will be returned from the getMany function. It is a type of react-query hook.
