import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "node:url";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  docs: { autodocs: "tag" },
  // tokens/ fica fora do pacote do Storybook (fonte única compartilhada com o Figma)
  viteFinal: async (cfg) => {
    cfg.server = { ...cfg.server, fs: { allow: [fileURLToPath(new URL("../..", import.meta.url))] } };
    return cfg;
  },
};
export default config;
