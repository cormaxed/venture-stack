import { SSTConfig } from "sst";
import { VentureStack } from "./stacks/VentureStack";

export default {
  config(_input) {
    return {
      name: "venture-stack",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(VentureStack);
  },
} satisfies SSTConfig;
