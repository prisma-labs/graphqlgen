import { GraphQLResolveInfo } from "graphql";

export interface ResolverFn<Root, Args, Ctx, Payload> {
  (root: Root, args: Args, ctx: Ctx, info: GraphQLResolveInfo):
    | Payload
    | Promise<Payload>;
}

export interface ITypes {
  Context: any;

  QueryRoot: any;
  NumberRoot: any;
}

export namespace IQuery {
  export type IdResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    string
  >;

  export type Custom_requiredResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    T["NumberRoot"]
  >;

  export type Custom_nullableResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    T["NumberRoot"]
  >;

  export type Custom_array_nullableResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    T["NumberRoot"][]
  >;

  export type Custom_array_requiredResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    T["NumberRoot"][]
  >;

  export interface ArgsCustom_with_arg {
    id: number;
  }

  export type Custom_with_argResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    T["NumberRoot"]
  >;

  export interface ArgsCustom_with_custom_arg {
    id: T["NumberRoot"];
  }

  export type Custom_with_custom_argResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    T["NumberRoot"]
  >;

  export type Scalar_requiredResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    boolean
  >;

  export type Scalar_nullableResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    boolean
  >;

  export type Scalar_array_nullableResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    boolean[]
  >;

  export type Scalar_array_requiredResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    boolean[]
  >;

  export interface ArgsScalar_with_arg {
    id: number;
  }

  export type Scalar_with_argResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    boolean
  >;

  export interface ArgsScalar_with_custom_arg {
    id: T["BooleanRoot"];
  }

  export type Scalar_with_custom_argResolver<T extends ITypes> = ResolverFn<
    T["QueryRoot"],
    {},
    T["Context"],
    boolean
  >;

  export interface Resolver<T extends ITypes> {
    id: IdResolver<T>;
    custom_required: Custom_requiredResolver<T>;
    custom_nullable: Custom_nullableResolver<T>;
    custom_array_nullable: Custom_array_nullableResolver<T>;
    custom_array_required: Custom_array_requiredResolver<T>;
    custom_with_arg: Custom_with_argResolver<T>;
    custom_with_custom_arg: Custom_with_custom_argResolver<T>;
    scalar_required: Scalar_requiredResolver<T>;
    scalar_nullable: Scalar_nullableResolver<T>;
    scalar_array_nullable: Scalar_array_nullableResolver<T>;
    scalar_array_required: Scalar_array_requiredResolver<T>;
    scalar_with_arg: Scalar_with_argResolver<T>;
    scalar_with_custom_arg: Scalar_with_custom_argResolver<T>;
  }
}

export namespace INumber {
  export type IdResolver<T extends ITypes> = ResolverFn<
    T["NumberRoot"],
    {},
    T["Context"],
    string
  >;

  export type ValueResolver<T extends ITypes> = ResolverFn<
    T["NumberRoot"],
    {},
    T["Context"],
    number
  >;

  export interface Resolver<T extends ITypes> {
    id: IdResolver<T>;
    value: ValueResolver<T>;
  }
}

export interface IResolvers<T extends ITypes> {
  Query: IQuery.Resolver<T>;
  Number: INumber.Resolver<T>;
}
