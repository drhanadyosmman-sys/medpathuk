import { Redirect } from "wouter";

// Billing is handled off-site — there are no in-app plans or upgrades for now.
// The plan content is preserved in git history if it needs to return later.
export default function Pricing() {
  return <Redirect to="/dashboard" />;
}
