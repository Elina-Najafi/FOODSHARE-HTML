# FOODSHARE — Restaurant Web App
**ITEC 3230 Group Project** | Figma → HTML/CSS Implementation

Helya Sabetpour 
Elina Najafi

Figma Link : https://www.figma.com/design/Vj41cmQkjJHGwiJRgiCUjP/Untitled?node-id=0-1&t=XaE5RmyVmzYxb0W0-1

---

## Project Overview

A responsive, multi-page restaurant ordering web app built from a Figma design.
Stack: **HTML5 + CSS3 + Vanilla JavaScript** — no build tools, no dependencies. Open any file directly in a browser.

---

## Folder Structure

```
FOODSHARE-HTML/
│
├── index.html          ← Landing Page (Hero, CTA)
├── menu.html           ← Full Menu (category filter + cart sidebar)
├── customize.html      ← Order Customization + Spice Warning Modal
├── Cart.html           ← Cart review page
├── checkout.html       ← Checkout form (contact + delivery info)
├── thankyou.html       ← Order confirmation page
├── Kitchen.html        ← Kitchen order dashboard (staff view)
│
├── css/
│   └── style.css       ← All styles: design tokens, global layout, per-page rules
│
├── js/
│   └── main.js         ← Filter, qty stepper, spice modal, cart logic, URL params
│
├── assets/
│   └── images/         ← Food photos + hero background
│
└── README.md
```

---

## Pages

### `index.html` — Landing Page
- Fixed navbar with "View Menu" and Cart icon
- Full-viewport hero with background image and overlay
- Headline, tagline, and "Order Now" CTA → links to `menu.html`

### `menu.html` — Menu Page
- Sticky filter bar: All / Wraps / Bowls / Sides
- 3-column responsive card grid (2-col ≤900px, 1-col ≤600px)
- Each card: food image, name, price, category badge, "Customize" button
- Passing `?item=<id>` to `customize.html` pre-fills the item
- Empty-state message when no items match the active filter
- Cart sidebar showing selected items and running total

### `customize.html` — Customization Page
- Item header (name, category badge, base price)
- Size selector: Small / Medium / Large (styled radio buttons)
- Protein selector: Chicken / Beef / Salmon / Tuna
- Toppings checkboxes: Lettuce, Tomato, Onions, Black Beans, Corn, Cheese, Guacamole
- Spice level toggle buttons: No Spice → Extra Hot
- Sauce checkboxes: Mayo, Chipotle, BBQ, Hot Sauce, Tahini
- Quantity stepper (1–20), live price update
- "Add to Cart" with green confirmation feedback
- High-spice warning modal for Hot / Extra Hot

### `Cart.html` — Cart Page
- Itemized list of cart contents with quantities and prices
- Order subtotal and proceed-to-checkout CTA

### `checkout.html` — Checkout Page
- Contact and delivery information form
- Order summary before final submission

### `thankyou.html` — Confirmation Page
- Order confirmation message shown after successful checkout

### `Kitchen.html` — Kitchen Dashboard
- Staff-facing view of incoming orders (internal use)

---

## Implementation Notes

### Design Tokens
All colors are CSS custom properties in `style.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#fffcf6` | Warm cream — all page backgrounds |
| `--orange` | `#f96312` | CTA buttons, prices, active states |
| `--orange-alt` | `#fc8a06` | Active filter button |
| `--border` | `#d0cccc` | Card and input borders |
| `--text-dark` | `#000000` | Headings and labels |
| `--text-muted` | `#595959` | Taglines and descriptions |

### JavaScript (`main.js`)
- **Category filter**: toggles `.hidden` on `.menu-card` by `data-cat` attribute
- **Quantity stepper**: clamps qty 1–20, updates CTA price label live
- **Spice modal**: intercepts Hot/Extra Hot, requires confirmation before applying
- **Cart logic**: persists selections to `localStorage`, syncs across pages
- **URL params**: `?item=<id>` pre-populates item name, badge, and base price from the `ITEMS` map

---

## How to Run

```bash
git clone https://github.com/Elina-Najafi/FOODSHARE-HTML.git
```

Open `index.html` in any modern browser — no server needed.

> For live reload during development: VS Code **Live Server** extension

---

*Built for ITEC 3230 — Web Technologies*
