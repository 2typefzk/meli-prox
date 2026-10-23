import type { Preview } from "@storybook/react";
import "../../tokens/tokens.css";
import "../src/styles/components.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Tema / produto",
      toolbar: {
        title: "Tema",
        icon: "paintbrush",
        items: [
          { value: "mp-light", title: "Mercado Pago · Light" },
          { value: "mp-dark", title: "Mercado Pago · Dark" },
          { value: "ml-light", title: "Mercado Livre · Web" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "mp-light" },
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    options: { storySort: { order: ["Introdução", "Foundations", "Components", "Web (Mercado Livre)", "Patterns"] } },
  },
  decorators: [
    (Story, ctx) => (
      <div data-theme={ctx.globals.theme} className="sb-theme-root">
        <Story />
      </div>
    ),
  ],
};
export default preview;
