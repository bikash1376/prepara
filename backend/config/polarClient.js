import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: process.env.POLAR_ENV === "sandbox" ? "sandbox" : "production",
});

export default polar;
