import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Poppins', sans-serif` },
        body: { value: `'Poppins', sans-serif` },
      },
    },
  },
});
