import { defineField, defineType } from 'sanity';

export const brandType = defineType({
  name: 'brand',
  title: 'Brand',
  type: 'document',
  groups: [
    { name: 'basicDetails', title: 'Basic Details', default: true },
    { name: 'images', title: 'Images' },
    { name: 'displaySettings', title: 'Display Settings' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Brand Name',
      type: 'string',
      group: 'basicDetails',
      description: 'e.g. Toyota, Nissan, Suzuki.',
      validation: (rule) =>
        rule.required().error('Brand name is required (e.g. "Toyota").'),
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
      name: 'popularModels',
      title: 'Popular Models (teaser text)',
      type: 'array',
      group: 'basicDetails',
      description:
        'Up to 3 model names shown on the brand card as a preview line, e.g. "Aqua · Prius · Hiace".',
      of: [{ type: 'string' }],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'images',
      description: 'Optional brand logo (monochrome recommended).',
      options: { sources: [] },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'images',
      description: 'This image appears on the brand card in the catalogue.',
      options: { hotspot: true, sources: [] },
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      group: 'displaySettings',
      description: 'Lower numbers appear first.',
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
    select: { title: 'name', media: 'coverImage' },
  },
});
