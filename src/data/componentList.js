export const componentList = [
  {
    name: "Button",
    dependencies: ["motion", "clsx", "tailwind-merge"],
    internalDependencies: [],
  },
  {
    name: "Navbar",
    dependencies: [
      "react-icons",
      "motion",
      "clsx",
      "tailwind-merge",
      "@radix-ui/react-collapsible",
    ],
    internalDependencies: ["Button", "Input"],
  },
  {
    name: "ProductCard",
    dependencies: ["motion", "react-icons", "clsx", "tailwind-merge"],
    internalDependencies: ["Button"],
  },
  {
    name: "Input",
    dependencies: ["clsx", "tailwind-merge"],
    internalDependencies: [],
  },
  {
    name: "LoginCard",
    dependencies: ["clsx", "tailwind-merge"],
    internalDependencies: ["Input", "Button"],
  },
];
