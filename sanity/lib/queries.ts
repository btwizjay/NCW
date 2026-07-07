import { groq } from 'next-sanity';

// ── Brands ────────────────────────────────────────────────────
// Counts are calculated server-side so the client never has to
// manually enter "3 models" or "12 work items" — they update
// automatically as models/items are published.

export const brandsQuery = groq`*[_type == "brand" && isActive != false] | order(coalesce(order, 9999) asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  logo,
  coverImage,
  popularModels,
  order,
  "modelCount": count(*[_type == "vehicleModel" && brand._ref == ^._id && isActive != false]),
  "workItemCount": count(*[_type == "product" && brand._ref == ^._id && isActive != false])
}`;

export const brandBySlugQuery = groq`*[_type == "brand" && slug.current == $brandSlug && isActive != false][0] {
  _id,
  name,
  "slug": slug.current,
  logo,
  coverImage,
  popularModels,
  order,
  "modelCount": count(*[_type == "vehicleModel" && brand._ref == ^._id && isActive != false]),
  "workItemCount": count(*[_type == "product" && brand._ref == ^._id && isActive != false])
}`;

// Used by the back-compat redirect: resolve an old display-name URL
// (e.g. `?brand=Toyota`) to the current Sanity slug.
export const brandSlugByNameQuery = groq`*[_type == "brand" && name == $brandName && isActive != false][0].slug.current`;

// ── Vehicle Models ────────────────────────────────────────────

export const modelsForBrandQuery = groq`*[_type == "vehicleModel" && brand->name == $brandName && isActive != false] | order(coalesce(order, 9999) asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  coverImage,
  shortNote,
  "brandName": brand->name,
  "brandSlug": brand->slug.current,
  "workItemCount": count(*[_type == "product" && model._ref == ^._id && isActive != false])
}`;

export const modelsForBrandSlugQuery = groq`*[_type == "vehicleModel" && brand->slug.current == $brandSlug && isActive != false] | order(coalesce(order, 9999) asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  coverImage,
  shortNote,
  "brandName": brand->name,
  "brandSlug": brand->slug.current,
  "workItemCount": count(*[_type == "product" && model._ref == ^._id && isActive != false])
}`;

export const allModelsQuery = groq`*[_type == "vehicleModel" && isActive != false] | order(coalesce(order, 9999) asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  coverImage,
  shortNote,
  "brandName": brand->name,
  "brandSlug": brand->slug.current,
  "workItemCount": count(*[_type == "product" && model._ref == ^._id && isActive != false])
}`;

export const modelBySlugQuery = groq`*[_type == "vehicleModel" && slug.current == $modelSlug && brand->slug.current == $brandSlug && isActive != false][0] {
  _id,
  name,
  "slug": slug.current,
  coverImage,
  shortNote,
  "brandName": brand->name,
  "brandSlug": brand->slug.current,
  "workItemCount": count(*[_type == "product" && model._ref == ^._id && isActive != false])
}`;

// Used by the back-compat redirect: resolve an old display-name model URL
// (e.g. `?model=Hiace+KDH+200`) to the current Sanity slug for the given brand.
export const modelSlugByNameQuery = groq`*[_type == "vehicleModel" && name == $modelName && brand->slug.current == $brandSlug && isActive != false][0].slug.current`;

// ── Work Items (Products) ─────────────────────────────────────
// coalesce handles migration: old products stored brand/model as
// strings; new ones store them as references. Both shapes return
// a usable brand/model name.

export const productsQuery = groq`*[_type == "product" && isActive != false] | order(coalesce(order, 9999) asc, _createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  "brandName": coalesce(brand->name, brand),
  "brandSlug": brand->slug.current,
  "modelName": coalesce(model->name, vehicleModel),
  "modelSlug": model->slug.current,
  category,
  summary,
  longDescription,
  image,
  gallery,
  featured,
  order,
  whatsappMessage
}`;

export const featuredProductsQuery = groq`*[_type == "product" && featured == true && isActive != false] | order(coalesce(order, 9999) asc, _createdAt desc)[0...6] {
  _id,
  title,
  "slug": slug.current,
  "brandName": coalesce(brand->name, brand),
  "brandSlug": brand->slug.current,
  "modelName": coalesce(model->name, vehicleModel),
  "modelSlug": model->slug.current,
  category,
  summary,
  image,
  featured,
  order,
  whatsappMessage
}`;

export const productsForBrandSlugQuery = groq`*[_type == "product" && brand->slug.current == $brandSlug && isActive != false] | order(coalesce(order, 9999) asc, _createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  "brandName": coalesce(brand->name, brand),
  "brandSlug": brand->slug.current,
  "modelName": coalesce(model->name, vehicleModel),
  "modelSlug": model->slug.current,
  category,
  summary,
  longDescription,
  image,
  gallery,
  featured,
  order,
  whatsappMessage
}`;

export const productsForBrandModelSlugQuery = groq`*[_type == "product" && brand->slug.current == $brandSlug && model->slug.current == $modelSlug && isActive != false] | order(coalesce(order, 9999) asc, _createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  "brandName": coalesce(brand->name, brand),
  "brandSlug": brand->slug.current,
  "modelName": coalesce(model->name, vehicleModel),
  "modelSlug": model->slug.current,
  category,
  summary,
  longDescription,
  image,
  gallery,
  featured,
  order,
  whatsappMessage
}`;

export const productBySlugQuery = groq`*[_type == "product" && slug.current == $itemSlug && brand->slug.current == $brandSlug && model->slug.current == $modelSlug && isActive != false][0] {
  _id,
  title,
  "slug": slug.current,
  "brandName": coalesce(brand->name, brand),
  "brandSlug": brand->slug.current,
  "modelName": coalesce(model->name, vehicleModel),
  "modelSlug": model->slug.current,
  category,
  summary,
  longDescription,
  image,
  gallery,
  featured,
  order,
  whatsappMessage
}`;

// Used by the back-compat redirect: resolve an old display-name item URL
// (e.g. `?item=...`) — items already use slugs in the old flow, so this is
// only a fallback for matches against title.
export const productSlugByTitleQuery = groq`*[_type == "product" && title == $itemTitle && isActive != false][0] {
  "slug": slug.current,
  "brandSlug": brand->slug.current,
  "modelSlug": model->slug.current
}`;
