import { Outlet, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createRootRoute({
  notFoundComponent: () => <div>Page not found</div>,
  component: RootComponent,
});

function RootComponent() {
  return <RootDocument><Outlet /></RootDocument>;
}

function RootDocument({ children }: { children: ReactNode }) {
  return <div className="root-layout">{children}</div>;
}