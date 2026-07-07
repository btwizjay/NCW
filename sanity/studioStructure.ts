import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Nilantha Cushion Works')
    .items([
      // ── Bookings ──────────────────────────────────────────────
      S.listItem()
        .id('bookings')
        .title('Bookings')
        .child(
          S.list()
            .title('Bookings')
            .items([
              S.listItem()
                .id('bookingsRequested')
                .title('Requested')
                .child(
                  S.documentList()
                    .title('Requested')
                    .filter('_type == "booking" && status == "requested"')
                    .defaultOrdering([
                      { field: 'date', direction: 'asc' },
                      { field: 'time', direction: 'asc' },
                    ]),
                ),
              S.listItem()
                .id('bookingsConfirmed')
                .title('Confirmed')
                .child(
                  S.documentList()
                    .title('Confirmed')
                    .filter('_type == "booking" && status == "confirmed"')
                    .defaultOrdering([
                      { field: 'date', direction: 'asc' },
                      { field: 'time', direction: 'asc' },
                    ]),
                ),
              S.listItem()
                .id('bookingsAll')
                .title('All bookings')
                .schemaType('booking')
                .child(
                  S.documentTypeList('booking')
                    .title('All bookings')
                    .defaultOrdering([{ field: 'date', direction: 'desc' }]),
                ),
            ]),
        ),

      S.divider(),

      // ── Catalogue ─────────────────────────────────────────────
      S.listItem()
        .id('brands')
        .title('Brands')
        .schemaType('brand')
        .child(S.documentTypeList('brand').title('Brands')),
      S.listItem()
        .id('vehicleModels')
        .title('Vehicle Models')
        .schemaType('vehicleModel')
        .child(S.documentTypeList('vehicleModel').title('Vehicle Models')),
      S.listItem()
        .id('workItems')
        .title('Work Items')
        .schemaType('product')
        .child(S.documentTypeList('product').title('Work Items')),
    ]);
