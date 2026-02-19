export const queryServices = (categories?: number[], search?: string, visible?: boolean) => {
    return {
        servicesCategories: categories?.length
            ? {
                  some: { categoryId: { in: categories } },
              }
            : undefined,
        name: search ? { contains: search } : undefined,
        visible,
    };
};
