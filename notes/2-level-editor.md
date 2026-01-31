# Feature: Level Editor

We have the level's definition in `app/lib/levels.ts`.
We need to have a separate page to allow the developer to make new levels in a more intuitive and straightforward way.
The page can reuse some UI components (for example, the grid structure).

The page should be at url: `/editor`

The page shall allow the users to
- [ ] change the size of the total grid
- [ ] select a cell in the grid, and change its type or by right click or its content
- [ ] drag the content (a letter in the main grid) to another place
- [ ] delete a piece by right click and select delete
- [ ] change the type of a piece (union, xor, intersect...) by right click
- [ ] drag a piece to another place in the inventory
- [ ] create new regions (MAIN, ALLOWED, DISALLOWED, INVENTORY) by press a button, and drag-select on the total grid
- [ ] validate the grid
	- [ ] pieces are all in inventory
- [ ] export the configuration into a `.ts` file

Test:

After implemented the features, test whether the project builds by using

```bash
pnpm build
```