import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/team-builder", "routes/team-builder.tsx"),
  route("/aetherdex", "routes/aetherdex.tsx"),
] satisfies RouteConfig;
