"use server";
import { IPagesEntity } from "oneentry/dist/pages/pagesInterfaces";
import { fetchApiclient } from "@/lib/oneentry";
import { getCatalogs } from "./getCatalogs";

export const getCatalogWithProducts = async () => {
  const apiClient = await fetchApiclient();
  const catalogs: IPagesEntity[] = await getCatalogs();

  const catalogWithProducts = [];
  if (catalogs) {
    for (const catalog of catalogs) {
      const products = await apiClient?.Products.getProductsByPageId(
        catalog.id,
        undefined,
        "en_US",
        {
          limit: 4,
          offset: 0,
          sortOrder: null,
          sortKey: null,
        }
      );
    //   console.log(products);
      catalogWithProducts.push({ ...catalog, catalogProducts: products });
    }
    console.log(catalogWithProducts);
    return catalogWithProducts;
  }
};
