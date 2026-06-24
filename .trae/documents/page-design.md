## 1. Visual Direction
The interface should feel like a premium workshop control panel: dark, precise, and efficient, with bright utility accents that guide the cashier's attention to the next required action.
- Tone: industrial, confident, high-contrast, and operational rather than decorative
- Visual memory: neon cyan and lime highlights against graphite surfaces, resembling diagnostic equipment and dashboard lights
- UI principle: every critical action should be visible within one scan, with strong emphasis on totals, transaction status, and next-step actions

## 2. Design Tokens
| Token | Suggested Value | Purpose |
|-------|------------------|---------|
| Background | `#0B0D12` | Main application shell |
| Surface | `#141922` | Cards, tables, and form panels |
| Surface Alt | `#1A2230` | Hover and layered sections |
| Text Primary | `#F3F7FB` | Main readable content |
| Text Secondary | `#95A3B8` | Metadata and labels |
| Accent Cyan | `#2DE2E6` | Primary action and focus state |
| Accent Lime | `#B7FF3C` | Success, totals, and active badges |
| Accent Amber | `#FFB84D` | Warning and pending items |
| Accent Red | `#FF5D5D` | Error and destructive actions |

## 3. Typography
- Heading font: a condensed, mechanical-looking display face suitable for dashboard headlines
- Body font: a neutral sans-serif with excellent legibility in tables and forms
- Hierarchy: dense but controlled, with compact labels and medium-sized numerical KPIs
- Number styling: large totals and transaction values should use bold, tabular-friendly presentation

## 4. Page-Level Guidance
| Page | Layout Direction | Key UI Notes |
|------|------------------|-------------|
| Dashboard | Multi-card overview with wide content rail | Emphasize live totals, quick filters, and recent transaction cards |
| POS | Split layout with searchable catalog and sticky cart panel | Keep checkout controls fixed and totals highly visible |
| Catalog | Toolbar + data table/grid | Support fast editing with compact forms and strong category chips |
| Customers | Search list + detail side panel | Show contact details and latest service context without clutter |
| Transactions | Filter-first history table | Open details in a drawer/modal for review and printing |
| Reports | Analytical summary layout | Use charts sparingly and prioritize readable grouped totals |
| Settings | Stacked configuration sections | Include a deployment/env readiness checklist and business defaults |

## 5. Interaction Patterns
- Use sticky totals and sticky action bars on operational pages
- Provide instant recalculation feedback when quantity, discount, or payment selection changes
- Prefer drawers and modals for focused editing so users do not lose page context
- Use subtle glow, border emphasis, and shadow elevation to show active selection instead of large animations
- Keep transition timing short and purposeful so the interface still feels fast at a cashier counter

## 6. Responsiveness
- Desktop-first for cashier desks and operator terminals
- Tablet support with vertically stacked cart and product panels
- Mobile view prioritized for monitoring and simple lookup, not full checkout speed

## 7. Accessibility Expectations
- Maintain strong contrast across all dashboard surfaces
- Ensure keyboard access for search, cart navigation, and payment completion
- Use clear success, warning, and error states with both color and text indicators
