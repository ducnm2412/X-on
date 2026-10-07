// Demo content for the X-ON storefront and admin. No backend: this file is the seed "database".

export const BRAND = {
  name: "X-ON",
  line: "Press On. Slay On. Repeat.",
  address: "3168 Bill Beck Blvd, Kissimmee, FL 34744",
  street: "3168 Bill Beck Blvd",
  city: "Kissimmee, FL 34744",
  phone: "689-212-8888",
  phoneHref: "tel:+16892128888",
  email: "hello@x-on.shop",
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=3168+Bill+Beck+Blvd+Kissimmee+FL+34744",
};

export const SHAPES = ["Almond", "Coffin", "Oval", "Round", "Square", "Stiletto"] as const;
export type Shape = (typeof SHAPES)[number];

export const SIZES = ["XS", "S", "M", "L"] as const;
export type Size = (typeof SIZES)[number];

// Nail width in mm per finger: thumb, index, middle, ring, pinky.
export const FINGERS = ["Thumb", "Index", "Middle", "Ring", "Pinky"] as const;
export const SIZE_CHART: Record<Size, number[]> = {
  XS: [14, 10, 11, 10, 7],
  S: [15, 11, 12, 11, 8],
  M: [16, 12, 13, 12, 9],
  L: [17, 13, 14, 13, 10],
};

export const PRODUCT_TYPES = [
  { slug: "handmade-press-on-nails", name: "Handmade Press-On Nails" },
  { slug: "nail-essentials", name: "Nail Essentials" },
  { slug: "bundle", name: "Bundles" },
] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number]["slug"];

export const THEMES = [
  { slug: "floral", name: "Floral" },
  { slug: "chrome-metal", name: "Chrome & Metal" },
  { slug: "fruit-candy", name: "Fruit & Candy" },
  { slug: "animal-print", name: "Animal Print" },
  { slug: "french", name: "French" },
] as const;
export type Theme = (typeof THEMES)[number]["slug"];

export type Art = "glue" | "tabs" | "prep" | "file" | "oil" | "remover";

export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  type: ProductType;
  shape?: Shape;
  themes: Theme[];
  price: number;
  salePrice?: number;
  sizes: Size[];
  image?: string; // photo in /public
  art?: Art; // drawn placeholder for products without a photo yet
  bestSeller?: boolean;
  status: "Active" | "Draft" | "Out of stock";
  stock: number;
  updated: string;
  description: string;
  info: [string, string][];
};

// Photo library. `origin` is where the crop zooms in, so each tile frames the nails.
export const PHOTOS: Record<string, { origin: string; zoom: number; alt: string }> = {
  "/IMG_7098.JPG": { origin: "46% 52%", zoom: 1.32, alt: "Stiletto set in emerald, nude and molten gold" },
  "/IMG_7099.JPG": { origin: "50% 52%", zoom: 1.3, alt: "Almond set with pink confetti, aqua and gold-edged butterflies" },
  "/IMG_7100.JPG": { origin: "50% 48%", zoom: 1.3, alt: "Coffin set with blue 3D flowers over orange leopard tips" },
  "/IMG_7101.JPG": { origin: "50% 55%", zoom: 1.24, alt: "Stiletto set with citrus slices, blueberries and bows" },
  "/IMG_7102.JPG": { origin: "50% 58%", zoom: 1.3, alt: "Rounded set in lemon, tortoiseshell and gold chrome" },
  "/IMG_7103.JPG": { origin: "50% 56%", zoom: 1.34, alt: "Almond set in sheer blush with gold vines and pink petals" },
  "/IMG_7104.JPG": { origin: "46% 54%", zoom: 1.32, alt: "Stiletto set in liquid chrome, cat-eye blue and mosaic" },
  "/IMG_7105.JPG": { origin: "50% 56%", zoom: 1.22, alt: "Coffin set with yellow orchids, dots and crystal cuffs" },
  "/IMG_7106.JPG": { origin: "50% 58%", zoom: 1.26, alt: "Oval set in mint and pink with sculpted blossoms and serpents" },
  "/IMG_7107.JPG": { origin: "50% 58%", zoom: 1.3, alt: "Square set in candy colour blocks with gold beads" },
  "/essentials/bottle.jpg": { origin: "48% 30%", zoom: 1.5, alt: "A gloved hand lifting a brush-cap bottle out of the set" },
  "/essentials/tube.jpg": { origin: "52% 60%", zoom: 1.25, alt: "A gloved hand holding a tube of builder gel" },
  "/essentials/tool.jpg": { origin: "40% 55%", zoom: 1.15, alt: "A steel dual-ended tool held over the open set" },
  "/essentials/set.jpg": { origin: "55% 45%", zoom: 1.1, alt: "The builder gel set, opened, with its colour swatch card" },
  "/essentials/pearl.jpg": { origin: "50% 45%", zoom: 1.05, alt: "Two boards of pearl gel swatches, numbered 1 to 48" },
  "/essentials/cateye.jpg": { origin: "50% 50%", zoom: 1.05, alt: "Two boards of cat-eye gel swatches in 48 colours" },
  "/IMG_7110.JPG": { origin: "50% 58%", zoom: 1.36, alt: "Short square set with white French tips, daisies and pink chrome" },
};
export const PHOTO_LIST = Object.keys(PHOTOS);

const pressOnInfo = (shape: string, length: string): [string, string][] => [
  ["Shape", shape],
  ["Length", length],
  ["In the box", "10 nails in your size, glue, 24 adhesive tabs, file, cuticle stick, prep pad"],
  ["Wear", "Up to 2 weeks with glue, 1 to 3 days with tabs"],
  ["Reusable", "Yes, 3 or more wears with gentle removal"],
  ["Made in", "Kissimmee, Florida. Painted and sculpted by hand."],
];

type Seed = Omit<Product, "id" | "status" | "stock" | "updated" | "sizes" | "themes" | "type" | "info"> &
  Partial<Pick<Product, "status" | "stock" | "updated" | "sizes" | "themes" | "type" | "info">>;

const pressOns: Seed[] = [
  { slug: "emerald-dynasty", name: "Emerald Dynasty", sku: "XO-ST-0981", shape: "Stiletto", themes: ["chrome-metal"], price: 68, image: "/IMG_7098.JPG", bestSeller: true, description: "Deep emerald cat-eye stones set in hand-poured gold, with beaded cuffs on a sheer nude base. Our most photographed set.", info: pressOnInfo("Stiletto", "Long, 28 mm") },
  { slug: "butterfly-geode", name: "Butterfly Geode", sku: "XO-AL-0412", shape: "Almond", themes: ["floral", "fruit-candy"], price: 54, salePrice: 46, image: "/IMG_7099.JPG", bestSeller: true, description: "Pink confetti geodes and aqua pools outlined in raised gold, plus two hand-painted butterfly accents per hand.", info: pressOnInfo("Almond", "Medium, 22 mm") },
  { slug: "wild-hibiscus", name: "Wild Hibiscus", sku: "XO-CF-0356", shape: "Coffin", themes: ["floral", "animal-print"], price: 62, image: "/IMG_7100.JPG", description: "Sculpted blue hibiscus over orange leopard French tips, finished with gold rose charms and aurora crystals.", info: pressOnInfo("Coffin", "Long, 26 mm") },
  { slug: "citrus-picnic", name: "Citrus Picnic", sku: "XO-ST-0623", shape: "Stiletto", themes: ["fruit-candy"], price: 58, image: "/IMG_7101.JPG", bestSeller: true, description: "Jelly orange slices, 3D blueberries and gingham, tied up with sculpted bows. Summer, in ten nails.", info: pressOnInfo("Stiletto", "Long, 28 mm") },
  { slug: "amber-tortoise", name: "Amber Tortoise", sku: "XO-RD-0277", shape: "Round", themes: ["chrome-metal", "animal-print"], price: 56, image: "/IMG_7102.JPG", description: "Lemon stained glass, tortoiseshell tips and rippled gold chrome on a rounded medium length.", info: pressOnInfo("Round", "Medium, 20 mm") },
  { slug: "blush-vine", name: "Blush Vine", sku: "XO-AL-0158", shape: "Almond", themes: ["floral"], price: 48, image: "/IMG_7103.JPG", bestSeller: true, description: "Sheer blush ombré with fine gold vines and pink petals. Quiet enough for work, pretty enough for a wedding.", info: pressOnInfo("Almond", "Medium, 22 mm") },
  { slug: "chrome-tide", name: "Chrome Tide", sku: "XO-ST-0734", shape: "Stiletto", themes: ["chrome-metal"], price: 64, salePrice: 54, image: "/IMG_7104.JPG", description: "Liquid silver chrome wrapped around cat-eye blue, glossy black and a hand-laid mosaic accent.", info: pressOnInfo("Stiletto", "Long, 28 mm") },
  { slug: "sunny-orchid", name: "Sunny Orchid", sku: "XO-CF-0569", shape: "Coffin", themes: ["floral", "french"], price: 60, image: "/IMG_7105.JPG", description: "Matte nude with carved yellow French tips, hand-sculpted orchids and aurora crystal cuffs.", info: pressOnInfo("Coffin", "Long, 26 mm") },
  { slug: "sakura-serpent", name: "Sakura Serpent", sku: "XO-OV-0845", shape: "Oval", themes: ["floral"], price: 72, image: "/IMG_7106.JPG", status: "Out of stock", stock: 0, description: "Mint and pink cat-eye with sculpted cherry blossoms, pearls and white serpents. Each set takes six hours to make.", info: pressOnInfo("Oval", "Medium, 21 mm") },
  { slug: "pop-candy", name: "Pop Candy", sku: "XO-SQ-0390", shape: "Square", themes: ["fruit-candy"], price: 52, image: "/IMG_7107.JPG", description: "Velvet-matte colour blocks over jelly ombré with gold beads and tiny stars. No two nails match, on purpose.", info: pressOnInfo("Square", "Medium, 19 mm") },
  { slug: "daisy-french", name: "Daisy French", sku: "XO-SQ-0102", shape: "Square", themes: ["french", "floral"], price: 42, image: "/IMG_7110.JPG", description: "Short square French tips with pearl cuffs, hand-painted daisies and two pink chrome accents.", info: pressOnInfo("Square", "Short, 14 mm") },
];

const essentialInfo = (size: string, use: string): [string, string][] => [
  ["Size", size],
  ["Use", use],
  ["Suitable for", "Press-on, soft gel and acrylic tips"],
  ["Ships from", "Kissimmee, Florida"],
];

const essentials: Seed[] = [
  { slug: "brush-on-nail-glue", name: "Brush-On Nail Glue", sku: "XO-ES-GL07", price: 8, image: "/essentials/bottle.jpg", bestSeller: true, description: "A thin, even brush-on glue that sets in ten seconds and holds for up to two weeks.", info: essentialInfo("7 g bottle", "Thin coat on natural nail and press-on, hold 20 seconds") },
  { slug: "builder-gel-tube", name: "Builder Gel Tube", sku: "XO-ES-BG15", price: 12, image: "/essentials/tube.jpg", description: "A firm builder gel that stays where you put it. For extending tips, filling gaps and sculpting 3D pieces.", info: essentialInfo("15 ml tube", "Squeeze a bead, shape with the prep tool, cure 60 seconds") },
  { slug: "prep-kit", name: "Prep Tool", sku: "XO-ES-PT01", price: 10, salePrice: 8, image: "/essentials/tool.jpg", description: "Steel spatula at one end, shaping brush at the other. Lifts cuticles, places gel and smooths it flat.", info: essentialInfo("165 mm, stainless steel", "Push cuticles with the flat end, shape gel with the brush") },
  { slug: "builder-gel-set", name: "Builder Gel Set, 12 Colours", sku: "XO-ES-BS12", price: 64, image: "/essentials/set.jpg", bestSeller: true, description: "Twelve builder gels from clear to deep blush, with base, top coat and a swatch card, boxed for the desk.", info: essentialInfo("12 tubes of 15 ml, 3 bottles", "Everything to build, extend and finish a full set") },
  { slug: "pearl-gel-palette", name: "Pearl Gel Palette, 48 Shades", sku: "XO-ES-PP48", price: 46, image: "/essentials/pearl.jpg", description: "Forty-eight pearl shades on numbered swatch tips, so you can pick a colour by eye before you open a pot.", info: essentialInfo("48 pots of 5 ml, 2 swatch boards", "One thin coat over base colour, cure 60 seconds") },
  { slug: "cat-eye-gel-palette", name: "Cat-Eye Gel Palette, 48 Shades", sku: "XO-ES-CE48", price: 52, image: "/essentials/cateye.jpg", description: "Magnetic gels in forty-eight colours. Hold the magnet over the wet gel and the line of light follows it.", info: essentialInfo("48 pots of 5 ml, magnet, 2 swatch boards", "Apply, pull the line with the magnet, cure straight away") },
];

const bundleInfo = (items: string): [string, string][] => [
  ["Includes", items],
  ["Sizes", "Pick one size for every set in the bundle"],
  ["Ships", "Together, free within the US"],
];

const bundles: Seed[] = [
  { slug: "any-three-sets", name: "Any Three Sets", sku: "XO-BD-3SET", type: "bundle", price: 174, salePrice: 148, image: "/IMG_7099.JPG", description: "Choose any three handmade sets and take 15% off the lot.", info: bundleInfo("3 handmade press-on sets of your choice") },
  { slug: "first-set-starter", name: "First Set Starter", sku: "XO-BD-STRT", type: "bundle", price: 68, salePrice: 61, image: "/IMG_7103.JPG", description: "Blush Vine with a Prep Tool and Brush-On Glue. The easiest way to try press-ons.", info: bundleInfo("Blush Vine set, Prep Tool, Brush-On Nail Glue") },
  { slug: "salon-pro-ten", name: "Salon Pro Ten", sku: "XO-BD-PR10", type: "bundle", price: 580, salePrice: 435, image: "/IMG_7104.JPG", description: "Ten sets across our best sellers for salons and resellers. Mixed sizes available on request.", info: bundleInfo("10 handmade sets, 10 glues, 10 prep kits") },
  { slug: "essentials-refill-trio", name: "Essentials Refill Trio", sku: "XO-BD-REFL", type: "bundle", price: 27, salePrice: 22, image: "/essentials/tube.jpg", sizes: [], description: "Glue, builder gel and a prep tool. Restock the three things a desk runs out of first.", info: bundleInfo("Brush-On Nail Glue, Builder Gel Tube, Prep Tool") },
];

const dates = ["Oct 5, 2026", "Oct 2, 2026", "Sep 28, 2026", "Sep 24, 2026", "Sep 19, 2026", "Sep 12, 2026"];

function build(seeds: Seed[], type: ProductType, offset: number): Product[] {
  return seeds.map((s, i) => ({
    id: `p${offset + i + 1}`,
    type: s.type ?? type,
    themes: [],
    sizes: type === "nail-essentials" ? [] : [...SIZES],
    status: "Active",
    stock: 6 + ((i * 7 + offset) % 23),
    updated: dates[(i + offset) % dates.length],
    info: [],
    ...s,
  }));
}

export const PRODUCTS: Product[] = [
  ...build(pressOns, "handmade-press-on-nails", 0),
  ...build(essentials, "nail-essentials", 11),
  ...build(bundles, "bundle", 17),
];

export const money = (n: number) => `$${n.toFixed(2)}`;
export const discount = (p: Product) =>
  p.salePrice ? Math.round((1 - p.salePrice / p.price) * 100) : 0;
export const typeName = (t: ProductType) => PRODUCT_TYPES.find((x) => x.slug === t)?.name ?? t;
export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Collections reuse the Shop template; only the filter context changes.
export type Collection = { slug: string; title: string; blurb: string; filter: { type?: ProductType; shape?: Shape; theme?: Theme; best?: boolean } };
export const COLLECTIONS: Collection[] = [
  { slug: "best-sellers", title: "Best Sellers", blurb: "The sets and supplies that sell out first.", filter: { best: true } },
  { slug: "handmade-press-on-nails", title: "Handmade Press-On Nails", blurb: "Painted and sculpted by hand in Kissimmee, ten nails at a time.", filter: { type: "handmade-press-on-nails" } },
  { slug: "nail-essentials", title: "Nail Essentials", blurb: "The glue, builder gels and prep tools we use at our own desks.", filter: { type: "nail-essentials" } },
  ...SHAPES.map((s) => ({ slug: s.toLowerCase(), title: `${s} Nails`, blurb: `Every handmade set we make in ${s.toLowerCase()}.`, filter: { shape: s } })),
  ...THEMES.map((t) => ({ slug: t.slug, title: t.name, blurb: `Handmade sets in our ${t.name.toLowerCase()} theme.`, filter: { theme: t.slug } })),
];

export const REVIEWS = [
  { name: "Marisol G.", place: "Orlando, FL", product: "Blush Vine", rating: 5, text: "I wore Blush Vine for eleven days, through a beach weekend and a wedding. Three people asked which salon I go to." },
  { name: "Tanya R.", place: "Nail tech, Tampa", product: "Brush-On Nail Glue", rating: 5, text: "The glue is the only one I keep at my station now. Thin, no flooding, and it actually lasts." },
  { name: "Jess W.", place: "Atlanta, GA", product: "Citrus Picnic", rating: 5, text: "Size S fit every finger without filing. The blueberries are even cuter in person." },
  { name: "Priya K.", place: "Austin, TX", product: "Emerald Dynasty", rating: 4, text: "On my third wear of Emerald Dynasty and the gold still looks new. Removal took ten minutes." },
];

export type Block =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "img"; src: string; caption: string }
  | { kind: "list"; items: string[] };

export type Post = { slug: string; title: string; date: string; cover: string; excerpt: string; minutes: number; status: "Published" | "Draft"; blocks: Block[] };

export const POSTS: Post[] = [
  {
    slug: "how-a-handmade-set-gets-made", title: "How a handmade set gets made, hour by hour", date: "Oct 1, 2026", cover: "/IMG_7106.JPG", minutes: 6, status: "Published",
    excerpt: "Sakura Serpent takes six hours from blank tips to boxed set. Here is where the time goes.",
    blocks: [
      { kind: "p", text: "Modern nail artistry is slow work. A printed press-on comes off a line in seconds. A handmade set sits on our desks for most of a day, and you can see the difference from across a room." },
      { kind: "h", text: "Hour one: shaping ten blanks" },
      { kind: "p", text: "Every set starts as ten clear tips, filed to your size. We match the curve of each tip to the finger it is meant for, which is why a thumb in size M sits flat instead of springing up at the sides." },
      { kind: "img", src: "/IMG_7106.JPG", caption: "Sakura Serpent, finished and boxed. The blossoms are sculpted petal by petal." },
      { kind: "h", text: "Hours two to five: colour, sculpture, chrome" },
      { kind: "p", text: "Base colour goes on in three thin coats. Sculpted pieces like flowers, bows and serpents are built up in gel and cured in stages so they keep their height. Chrome is rubbed in last, over a no-wipe top coat." },
      { kind: "list", items: ["Cat-eye gel is set with a magnet before each cure", "3D pieces are sealed twice so they do not catch on hair", "Crystals are set in builder gel, not glue"] },
      { kind: "h", text: "Hour six: the finish" },
      { kind: "p", text: "A polished, luxury finish comes down to the edges. We cap every tip, check each nail under a lamp, then box the set with glue, tabs and a prep kit so it is ready to wear the day it arrives." },
    ],
  },
  {
    slug: "glue-or-tabs", title: "Glue or tabs? Pick by how long you want the set to last", date: "Sep 22, 2026", cover: "/IMG_7103.JPG", minutes: 4, status: "Published",
    excerpt: "Tabs for a weekend, glue for two weeks. A short guide to choosing, applying and removing both.",
    blocks: [
      { kind: "p", text: "Every X-ON set ships with both. Which one you reach for depends on your week." },
      { kind: "h", text: "Use tabs for one to three days" },
      { kind: "p", text: "Adhesive tabs are easier, faster and gentler. They suit an event, a shoot or a first try. Press the tab on, peel the film, press the nail on for ten seconds." },
      { kind: "h", text: "Use glue for up to two weeks" },
      { kind: "list", items: ["Buff the shine off your natural nail", "Wipe with the alcohol pad and let it dry", "Brush a thin coat on both surfaces", "Press from the cuticle forward and hold for 20 seconds"] },
      { kind: "img", src: "/IMG_7103.JPG", caption: "Blush Vine, our most reworn set." },
      { kind: "p", text: "To remove, soak in warm soapy water for ten minutes and lift from the side with the cuticle stick. Never pull from the tip." },
    ],
  },
  {
    slug: "statement-sets-for-fall", title: "Five statement sets we are wearing this fall", date: "Sep 14, 2026", cover: "/IMG_7098.JPG", minutes: 3, status: "Published",
    excerpt: "Emerald, tortoiseshell and liquid chrome. The statement-making sets our team keeps reaching for.",
    blocks: [
      { kind: "p", text: "Fall is when the bright fruit sets go back in the drawer and the metals come out." },
      { kind: "h", text: "Emerald Dynasty" },
      { kind: "p", text: "Cat-eye green stones framed in poured gold. It looks heavy and wears light." },
      { kind: "img", src: "/IMG_7098.JPG", caption: "Emerald Dynasty in stiletto." },
      { kind: "h", text: "Amber Tortoise and Chrome Tide" },
      { kind: "p", text: "One warm, one cold. Both pair with knitwear and both photograph well in low light." },
    ],
  },
  {
    slug: "stocking-a-nail-desk", title: "Stocking a nail desk: the essentials professionals reorder", date: "Sep 3, 2026", cover: "/IMG_7104.JPG", minutes: 5, status: "Published",
    excerpt: "What salon owners on our wholesale list buy every month, and what they skip.",
    blocks: [
      { kind: "p", text: "We asked forty wholesale customers what they reorder. The list was shorter than we expected." },
      { kind: "list", items: ["Brush-on glue, by the dozen", "Glass files, because clients keep them", "Prep kits to send home with every set", "Cuticle oil pens at the register"] },
      { kind: "p", text: "Quality, style and performance matter more at a desk than at home. A glue that floods costs a technician ten minutes per client." },
    ],
  },
  {
    slug: "find-your-size-in-five-minutes", title: "Find your press-on size in five minutes", date: "Aug 20, 2026", cover: "/IMG_7099.JPG", minutes: 3, status: "Published",
    excerpt: "A strip of tape, a pen and a ruler are all you need to measure all ten nails.",
    blocks: [
      { kind: "p", text: "Most returns are sizing. Most sizing problems come from guessing." },
      { kind: "list", items: ["Stick clear tape across the widest part of the nail", "Mark both edges with a pen", "Lay the tape on a ruler and read the millimetres", "Compare with our sizing chart, thumb to pinky"] },
      { kind: "p", text: "If you fall between sizes, go up and file the sides. A nail that is too narrow will lift." },
    ],
  },
  {
    slug: "kissimmee-studio-opening", title: "Our Kissimmee studio is open for pick-up", date: "Aug 6, 2026", cover: "/IMG_7110.JPG", minutes: 2, status: "Draft",
    excerpt: "Order online and collect at 3168 Bill Beck Blvd, Tuesday to Saturday.",
    blocks: [{ kind: "p", text: "Choose studio pick-up at checkout and we will text you when your set is boxed." }],
  },
];

export type GalleryItem = { id: string; title: string; image: string; product: string; sizes: Size[]; status: "Published" | "Hidden" };
export const GALLERY: GalleryItem[] = PRODUCTS.filter((p) => p.type === "handmade-press-on-nails").flatMap((p, i) => {
  const base = { title: p.name, image: p.image!, product: p.slug, status: "Published" as const };
  const sets: Size[][] = [["S", "M", "L"], ["XS", "S"], ["M", "L"], ["S", "M"]];
  return [
    { ...base, id: `g${i}a`, sizes: sets[i % 4] },
    { ...base, id: `g${i}b`, title: `${p.name}, worn`, sizes: sets[(i + 1) % 4] },
  ];
});

export type Upcoming = { id: string; name: string; when: string; note: string; images: string[]; featured?: boolean; enabled: boolean };
export const UPCOMING: Upcoming[] = [
  { id: "c0", name: "Gilded Hour", when: "Arrives Oct 24", note: "Eight sets in poured gold, emerald and tortoiseshell. The new collection, and our largest so far.", images: ["/IMG_7098.JPG", "/IMG_7102.JPG", "/IMG_7104.JPG"], featured: true, enabled: true },
  { id: "c1", name: "Holiday Frost", when: "November", note: "Silver chrome, snow cat-eye and pearl cuffs for the party season.", images: ["/IMG_7104.JPG", "/IMG_7110.JPG"], enabled: true },
  { id: "c2", name: "Valentine Bloom", when: "January", note: "Sheer pinks, sculpted roses and the return of Blush Vine in three new lengths.", images: ["/IMG_7103.JPG", "/IMG_7106.JPG"], enabled: true },
  { id: "c3", name: "Spring Orchard", when: "March", note: "Citrus, berries and gingham, sized down to short square for the first time.", images: ["/IMG_7101.JPG", "/IMG_7105.JPG"], enabled: true },
];

export type Order = { id: string; customer: string; email: string; date: string; status: "Pending" | "Paid" | "Shipped" | "Delivered" | "Refunded"; payment: string; address: string; items: { name: string; size?: Size; qty: number; price: number }[] };
export const ORDERS: Order[] = [
  { id: "XO-10482", customer: "Marisol Garcia", email: "marisol.g@example.com", date: "Oct 6, 2026", status: "Pending", payment: "Visa ending 4242", address: "1420 Lake Baldwin Ln, Orlando, FL 32814", items: [{ name: "Blush Vine", size: "S", qty: 1, price: 48 }, { name: "Brush-On Nail Glue", qty: 2, price: 8 }] },
  { id: "XO-10481", customer: "Tanya Reed", email: "tanya@gloss-studio.example", date: "Oct 6, 2026", status: "Paid", payment: "Mastercard ending 5510", address: "88 Bayshore Blvd, Tampa, FL 33606", items: [{ name: "Salon Pro Ten", size: "M", qty: 1, price: 435 }] },
  { id: "XO-10480", customer: "Jess Walker", email: "jessw@example.com", date: "Oct 5, 2026", status: "Shipped", payment: "PayPal", address: "915 Ponce de Leon Ave, Atlanta, GA 30306", items: [{ name: "Citrus Picnic", size: "S", qty: 1, price: 58 }, { name: "Prep Tool", qty: 1, price: 10 }] },
  { id: "XO-10479", customer: "Priya Kapoor", email: "priya.k@example.com", date: "Oct 4, 2026", status: "Delivered", payment: "Visa ending 1881", address: "2301 S Congress Ave, Austin, TX 78704", items: [{ name: "Emerald Dynasty", size: "M", qty: 1, price: 68 }] },
  { id: "XO-10478", customer: "Dana Brooks", email: "dana.b@example.com", date: "Oct 3, 2026", status: "Delivered", payment: "Apple Pay", address: "47 Hudson St, Jersey City, NJ 07302", items: [{ name: "Any Three Sets", size: "L", qty: 1, price: 148 }, { name: "Builder Gel Tube", qty: 1, price: 9 }] },
  { id: "XO-10477", customer: "Leah Nguyen", email: "leah.n@example.com", date: "Oct 2, 2026", status: "Refunded", payment: "Visa ending 7734", address: "610 Mission St, San Francisco, CA 94105", items: [{ name: "Chrome Tide", size: "XS", qty: 1, price: 54 }] },
  { id: "XO-10476", customer: "Camila Ortiz", email: "camila@example.com", date: "Oct 1, 2026", status: "Shipped", payment: "Visa ending 0093", address: "3900 Biscayne Blvd, Miami, FL 33137", items: [{ name: "Daisy French", size: "S", qty: 2, price: 42 }, { name: "Builder Gel Tube", qty: 1, price: 10 }] },
  { id: "XO-10475", customer: "Nora Kim", email: "nora.kim@example.com", date: "Sep 30, 2026", status: "Delivered", payment: "Mastercard ending 2207", address: "1200 Pike St, Seattle, WA 98101", items: [{ name: "Pop Candy", size: "M", qty: 1, price: 52 }] },
];
export const orderTotal = (o: Order) => o.items.reduce((s, i) => s + i.qty * i.price, 0);

export type Customer = { id: string; name: string; email: string; joined: string; orders: number; spent: number; status: "Active" | "Suspended" };
export const CUSTOMERS: Customer[] = [
  { id: "u1", name: "Marisol Garcia", email: "marisol.g@example.com", joined: "Mar 2, 2026", orders: 6, spent: 342, status: "Active" },
  { id: "u2", name: "Jess Walker", email: "jessw@example.com", joined: "Apr 18, 2026", orders: 3, spent: 174, status: "Active" },
  { id: "u3", name: "Priya Kapoor", email: "priya.k@example.com", joined: "May 9, 2026", orders: 4, spent: 251, status: "Active" },
  { id: "u4", name: "Dana Brooks", email: "dana.b@example.com", joined: "Jun 21, 2026", orders: 2, spent: 205, status: "Active" },
  { id: "u5", name: "Leah Nguyen", email: "leah.n@example.com", joined: "Jul 30, 2026", orders: 1, spent: 0, status: "Suspended" },
  { id: "u6", name: "Nora Kim", email: "nora.kim@example.com", joined: "Aug 14, 2026", orders: 2, spent: 110, status: "Active" },
];

export type Wholesale = { id: string; username: string; email: string; business: string; address: string; phone: string; membership: string; date: string; status: "New" | "Approved" | "Declined"; notes: string };
export const WHOLESALE: Wholesale[] = [
  { id: "w1", username: "gloss_studio", email: "tanya@gloss-studio.example", business: "Gloss Studio Tampa", address: "88 Bayshore Blvd, Tampa, FL 33606", phone: "813-555-0142", membership: "Wholesale customer", date: "Oct 5, 2026", status: "New", notes: "" },
  { id: "w2", username: "lunanails", email: "orders@lunanails.example", business: "Luna Nail Bar", address: "512 Park Ave, Winter Park, FL 32789", phone: "407-555-0178", membership: "Wholesale customer", date: "Oct 3, 2026", status: "New", notes: "" },
  { id: "w3", username: "petalandpolish", email: "hi@petalpolish.example", business: "Petal & Polish", address: "2100 Peachtree Rd, Atlanta, GA 30309", phone: "404-555-0119", membership: "Wholesale customer", date: "Sep 27, 2026", status: "Approved", notes: "Resale certificate on file. Net 15." },
  { id: "w4", username: "beautybyrae", email: "rae@example.com", business: "Beauty by Rae", address: "77 Main St, Kissimmee, FL 34741", phone: "689-555-0163", membership: "Wholesale customer", date: "Sep 20, 2026", status: "Declined", notes: "No business licence provided. Invited to reapply." },
];

export type Inquiry = { id: string; name: string; email: string; order: string; message: string; date: string; status: "Open" | "Replied" | "Closed"; note: string };
export const INQUIRIES: Inquiry[] = [
  { id: "i1", name: "Camila Ortiz", email: "camila@example.com", order: "XO-10476", message: "Can I change one of my Daisy French sets from S to M before it ships?", date: "Oct 6, 2026", status: "Open", note: "" },
  { id: "i2", name: "Hannah Lee", email: "hannah.lee@example.com", order: "", message: "Do you make custom sizes? My thumbs are 18 mm and everything else is a medium.", date: "Oct 5, 2026", status: "Open", note: "" },
  { id: "i3", name: "Leah Nguyen", email: "leah.n@example.com", order: "XO-10477", message: "The XS was too narrow on my ring fingers. How do I return it?", date: "Oct 2, 2026", status: "Replied", note: "Refund issued Oct 2. Sent sizing guide." },
  { id: "i4", name: "Monique Bell", email: "monique@example.com", order: "", message: "Are you taking bridal party orders for December? Six sets, all Blush Vine.", date: "Sep 29, 2026", status: "Closed", note: "Quoted Any Three Sets x2. Order placed." },
];

export type ContentSection = { key: string; label: string; heading: string; body: string; cta: string; visible: boolean };
export type ContentPage = { key: string; name: string; path: string; updated: string; sections: ContentSection[] };
export const CONTENT: ContentPage[] = [
  { key: "home", name: "Home", path: "/", updated: "Oct 4, 2026", sections: [
    { key: "hero", label: "Hero", heading: "Press on. Slay on. Repeat.", body: "Handmade press-on nails and the essentials to wear them well.", cta: "Shop press-ons", visible: true },
    { key: "handmade", label: "Handmade Press-On Nails", heading: "Handmade press-on nails", body: "Painted and sculpted by hand, ten nails at a time.", cta: "Shop all press-ons", visible: true },
    { key: "essentials", label: "Nail Essentials", heading: "Nail essentials", body: "The supplies we use at our own desks.", cta: "Shop essentials", visible: true },
    { key: "best", label: "Best Sellers", heading: "Best sellers", body: "", cta: "See all best sellers", visible: true },
    { key: "reviews", label: "Our Reviews", heading: "Our reviews", body: "", cta: "", visible: true },
    { key: "find", label: "Find Us", heading: "Find us in Kissimmee", body: "3168 Bill Beck Blvd, Kissimmee, FL 34744", cta: "Get directions", visible: true },
  ] },
  { key: "about", name: "About", path: "/about", updated: "Sep 30, 2026", sections: [
    { key: "title", label: "Title", heading: "Press On. Slay On. Repeat.", body: "X-ON is where modern nail artistry meets effortless beauty.", cta: "", visible: true },
    { key: "story", label: "Brand story", heading: "Made for nail lovers and professionals alike", body: "Created for nail lovers and professionals alike, X-ON offers handmade press-on nails and carefully selected nail essentials designed with quality, style, and performance in mind.", cta: "Shop the collection", visible: true },
  ] },
  { key: "bundle", name: "Bundle & Save", path: "/bundle-and-save", updated: "Sep 26, 2026", sections: [
    { key: "title", label: "Title", heading: "Bundle and save", body: "Buy sets together and save up to 25%.", cta: "", visible: true },
  ] },
  { key: "sizing", name: "Sizing Chart", path: "/sizing-chart", updated: "Sep 18, 2026", sections: [
    { key: "intro", label: "Introduction", heading: "Sizing chart", body: "Measure once, then order every set in the same size.", cta: "", visible: true },
    { key: "shapes", label: "Nail Shapes & Length", heading: "Nail shapes and length", body: "", cta: "", visible: true },
    { key: "length", label: "Length Details", heading: "Length details", body: "", cta: "", visible: true },
  ] },
  { key: "contact", name: "Contact", path: "/contact-us", updated: "Sep 11, 2026", sections: [
    { key: "hero", label: "Hero", heading: "Talk to X-ON", body: "Handmade press-on nails and carefully selected nail essentials.", cta: "Call 689-212-8888", visible: true },
    { key: "form", label: "Contact form", heading: "Contact X-ON", body: "We reply within one business day.", cta: "Send message", visible: true },
  ] },
];

export const LEGAL = [
  {
    slug: "terms", title: "Terms of Service", updated: "September 1, 2026",
    sections: [
      { h: "Using this site", p: ["These terms cover your use of x-on.shop and any order you place with X-ON, 3168 Bill Beck Blvd, Kissimmee, FL 34744. By placing an order you agree to them.", "You must be 18 or older, or have a parent or guardian's permission, to buy from us."] },
      { h: "Orders and pricing", p: ["Prices are in US dollars and exclude sales tax, which is added at checkout where it applies. Handmade sets are made in small batches, so colours and placement vary slightly from the photos.", "We may cancel an order if a set sells out before we can box it. If that happens we refund you in full within three business days."] },
      { h: "Shipping and returns", p: ["Orders ship from Kissimmee within two business days. Unworn sets in their original box can be returned within 14 days of delivery. Custom sizes and opened essentials are final sale."] },
      { h: "Wholesale accounts", p: ["Wholesale pricing is available to approved businesses only. We may ask for a resale certificate before approving an application."] },
      { h: "Contact", p: ["Questions about these terms go to hello@x-on.shop or 689-212-8888."] },
    ],
  },
  {
    slug: "privacy", title: "Privacy Policy", updated: "September 1, 2026",
    sections: [
      { h: "What we collect", p: ["When you order, create an account, apply for wholesale or contact us, we collect the details you enter: name, email, phone, addresses and order history.", "We do not store card numbers. Payments are handled by our payment provider."] },
      { h: "How we use it", p: ["We use your details to fill orders, answer questions and, if you opt in, send updates by email or text. Every message has an unsubscribe link; reply STOP to end texts."] },
      { h: "Who we share it with", p: ["Only the companies that help us run the shop: payment, shipping and email providers. We never sell personal data."] },
      { h: "Your choices", p: ["Ask us for a copy of your data, a correction or deletion at hello@x-on.shop. We respond within 30 days."] },
    ],
  },
];
