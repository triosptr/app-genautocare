## 1. Visual Direction
The interface should follow the brand palette and logo direction provided by the user: bold royal blue, electric lime, pure white, and muted charcoal with a sporty automotive identity.
- Tone: energetic, sporty, confident, and clearly branded rather than generic dashboard dark mode
- Visual memory: strong royal blue fields, electric lime highlights, italic display styling, and a logo lockup inspired by the provided `GEN AUTO CARE` mark
- UI principle: every important action should remain easy to scan, but the experience must now feel unmistakably aligned with the brand identity

## 2. Design Tokens
| Token | Suggested Value | Purpose |
|-------|------------------|---------|
| Royal Blue | `#1535D4` | Primary shell, branded navigation, and strong emphasis areas |
| Electric Lime | `#C8F400` | Accent actions, highlights, and interactive focus |
| Pure White | `#F9F9FF` | Clean contrast text and supporting light surfaces |
| Muted | `#373A4A` | Utility panels, deep contrast cards, and structural grounding |
| White Soft | `rgba(249, 249, 255, 0.14)` | Input backgrounds, dividers, and soft overlays |
| Blue Glow | `rgba(21, 53, 212, 0.35)` | Subtle branded depth and shadow accents |
| Lime Glow | `rgba(200, 244, 0, 0.35)` | Emphasis glow for primary actions and status |

## 3. Typography
- Heading font: bold condensed display styling with italic or slanted motion to echo the supplied logo direction
- Body font: a neutral sans-serif with excellent legibility in forms, tables, and operational views
- Hierarchy: uppercase section labels, strong logo-first branding, and compact data typography
- Number styling: large totals and transaction values should stay bold and highly legible against blue or muted backgrounds

## 4. Page-Level Guidance
| Page | Layout Direction | Key UI Notes |
|------|------------------|-------------|
| Dashboard | Multi-card overview with wide content rail | Use branded blue hero surfaces, lime highlights, and logo presence in the shell |
| POS | Split layout with searchable catalog and sticky cart panel | Keep totals loud and branded, with electric lime used for transaction completion emphasis |
| Catalog | Toolbar + data table/grid | Use clean muted panels and blue-hover accents rather than generic grayscale UI |
| Customers | Search list + detail side panel | Maintain clarity while aligning chips, forms, and CTA buttons to the brand palette |
| Transactions | Filter-first history table | Use blue and muted contrast blocks with white text for readable receipt-style summaries |
| Reports | Analytical summary layout | Highlight totals and progress bars in royal blue and electric lime |
| Settings | Stacked configuration sections | Treat integration status cards as branded operational checklists |

## 5. Interaction Patterns
- Use sticky totals and sticky action bars on operational pages
- Provide instant recalculation feedback when quantity, discount, or payment selection changes
- Prefer drawers and modals for focused editing so users do not lose page context
- Use royal blue and electric lime contrast to indicate hierarchy, selection, and confirmation states
- Keep transitions short and sporty, with a sense of speed rather than soft ambient motion

## 6. Responsiveness
- Desktop-first for cashier desks and operator terminals
- Tablet support with vertically stacked cart and product panels
- Mobile view prioritized for monitoring and simple lookup, not full checkout speed

## 7. Accessibility Expectations
- Maintain strong contrast across all dashboard surfaces
- Ensure keyboard access for search, cart navigation, and payment completion
- Use clear success, warning, and error states with both color and text indicators
