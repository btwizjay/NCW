import { defineField, defineType } from 'sanity';

export const vehicleModelType = defineType({
  name: 'vehicleModel',
  title: 'Vehicle Model',
  type: 'document',
  groups: [
    { name: 'basicDetails', title: 'Basic Details', default: true },
    { name: 'brandLink', title: 'Brand Link' },
    { name: 'images', title: 'Images' },
    { name: 'displaySettings', title: 'Display Settings' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Model Name',
      type: 'string',
      group: 'basicDetails',
      description: 'e.g. "Hiace KDH 200", "Aqua", "Prius".',
      validation: (rule) =>
        rule.required().error('Model name is required (e.g. "Aqua").'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basicDetails',
      description:
        'Used in the website URL. Click Generate after entering a name.',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) =>
        rule.required().error('Slug is required. Click Generate to create one.'),
    }),
    defineField({
      name: 'shortNote',
      title: 'Short Note',
      type: 'string',
      group: 'basicDetails',
      description:
        'Optional one-line note shown below the model name, e.g. "2015–2024 series".',
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
      group: ['basicDetails', 'brandLink'],
      description:
        'Which brand does this model belong to? Create the brand first if it does not exist.',
      validation: (rule) =>
        rule
          .required()
          .error(
            'Select the vehicle brand first. If it does not exist, create it under Brands.',
          ),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'images',
      description:
        'This image appears on the model card in the catalogue. Use a photo of this specific model.',
      options: { hotspot: true, sources: [] },
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      group: 'displaySettings',
      description: 'Lower numbers appear first within the same brand.',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      group: 'displaySettings',
      description: 'Turn off to hide from the catalogue without deleting.',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Name A → Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      brandName: 'brand.name',
      media: 'coverImage',
    },
    prepare({ title, brandName, media }) {
      return {
        title: title ?? 'Untitled model',
        subtitle: brandName ?? 'No brand',
        media,
      };
    },
  },
});
