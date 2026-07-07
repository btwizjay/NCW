import { defineField, defineType } from 'sanity';

const categories = [
  'Seat Set',
  'Cushion',
  'Door Panel',
  'Roof Lining',
  'Carpet',
] as const;

// Internal schema name stays 'product' to preserve existing Sanity documents.
// Studio displays it as "Work Item" for the client.
export const productType = defineType({
  name: 'product',
  title: 'Work Item',
  type: 'document',
  groups: [
    { name: 'cataloguePlacement', title: 'Catalogue Placement', default: true },
    { name: 'workDetails', title: 'Work Details' },
    { name: 'images', title: 'Images' },
    { name: 'displaySettings', title: 'Display Settings' },
  ],
  fields: [
    // ── Catalogue Placement ───────────────────────────────────
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
      group: 'cataloguePlacement',
      description:
        'Select the vehicle brand first. If it does not exist, create it under Brands.',
      validation: (rule) =>
        rule.required().error('Select the vehicle brand first.'),
    }),
    defineField({
      name: 'model',
      title: 'Vehicle Model',
      type: 'reference',
      to: [{ type: 'vehicleModel' }],
      group: 'cataloguePlacement',
      description:
        'Pick the vehicle model. The list is filtered by the brand you chose above. Create the vehicle model under the selected brand if it does not exist.',
      options: {
        filter: ({ document }: { document: Record<string, unknown> }) => {
          const brandRef = (document?.brand as { _ref?: string })?._ref;
          if (!brandRef) return { filter: '_type == "vehicleModel"' };
          return {
            filter: 'brand._ref == $brandRef',
            params: { brandRef },
          };
        },
      },
      validation: (rule) =>
        rule
          .required()
          .error(
            'Select a vehicle model. If it does not exist, create it first under Vehicle Models.',
          ),
    }),
    defineField({
      name: 'category',
      title: 'Category / Type',
      type: 'string',
      group: 'cataloguePlacement',
      description: 'What kind of work is this?',
      options: {
        list: categories.map((c) => ({ title: c, value: c })),
        layout: 'dropdown',
      },
      validation: (rule) => rule.required().error('Pick a category.'),
    }),

    // ── Work Details ──────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'workDetails',
      description: 'Display name, e.g. "Hiace KDH Seat Set".',
      validation: (rule) =>
        rule
          .required()
          .min(3)
          .error('Title is required (at least 3 characters).'),
    }),
    defineField({
      name: 'summary',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      group: 'workDetails',
      description: 'One or two sentences shown on the catalogue card.',
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
      rows: 10,
      group: 'workDetails',
      description:
        'Detailed description shown only on the work item detail page (under the short description). Line breaks are preserved.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'workDetails',
      description:
        'Used in the website URL. Click Generate after entering a title.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) =>
        rule.required().error('Slug is required. Click Generate to create one.'),
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'WhatsApp Enquiry Message',
      type: 'string',
      group: 'workDetails',
      description:
        'Optional custom message. Leave blank for the default ("I\'m interested in: …").',
    }),

    // ── Images ────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      group: 'images',
      description:
        'This image appears only on the work item card. Click the image to set a hotspot.',
      options: { hotspot: true, sources: [] },
      validation: (rule) => rule.required().error('A main image is required.'),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      group: 'images',
      description: 'Optional extra angles or detail shots.',
      of: [{ type: 'image', options: { hotspot: true, sources: [] } }],
    }),

    // ── Display Settings ──────────────────────────────────────
    defineField({
      name: 'featured',
      title: 'Featured on Home Page',
      type: 'boolean',
      group: 'displaySettings',
      description:
        'When on, this item is included in the home page "Featured work" section.',
      initialValue: false,
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
      title: 'Recently added',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      brandName: 'brand.name',
      modelName: 'model.name',
      category: 'category',
      featured: 'featured',
      media: 'image',
    },
    prepare({ title, brandName, modelName, category, featured, media }) {
      const parts = [brandName, modelName, category].filter(Boolean).join(' · ');
      return {
        title: `${featured ? '★ ' : ''}${title ?? 'Untitled'}`,
        subtitle: parts,
        media,
      };
    },
  },
});
