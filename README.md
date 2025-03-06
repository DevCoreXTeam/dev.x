# Dev.X - Web Application Development Automation Tool

![Dev.X Logo](assets/dev.x-logo.webp)

**Dev.X** is a tool that automates the development of web applications. It is capable of generating components, APIs, or complete websites based on templates, and much more.  

## 🚀 Installation

Install **Dev.X** globally using npm:

```bash
npm i -g @devcorex/dev.x
```

---

## **📜 Features**

1. **Generate Components**

The dev add command allows you to quickly generate reusable components for your projects.
By default, components are generated in:

```bash
./src/components/generated
```

**Supported Components**

- `Button`
- `Input`
- `Navbar`
- `LoginCard`
- `ProductCard`

**Basic Usage**

```bash
dev add <ComponentName>
```

**Example:**

```bash
dev add Button
```

This generates the Button component in the default path.

**Additional Parameters**

You can customize the generation process using the following parameters:

**Example with Parameters**

```bash
dev add Button --type tsx --framework next --theme default --output ./path/to/generate
```

**List Available Components**

```bash
dev add --list
```

This command displays all the available components you can generate.

---

2. **Project Generator**

The dev create command helps you bootstrap project structures for popular frameworks.

**Supported Frameworks**

- `Next.js`
- `React.js`
- `Nest.js`
- `Express.js`

**Basic Usage**

```bash
dev create <framework> --name <project-name>
```

**Example:**

```bash
dev create next --name next-app
```

```bash
dev create react -n react-app
```

**List Available Frameworks**

```bash
dev create --list
```

---

3. **Help and Version Commands**

Use these commands to get additional help or check the current version of Dev.X:

```bash
dev --help
dev --version
dev add --help
dev create --help
```

---

## 📖 **Future Features**

**Backend Development Automation:** Automate backend APIs and database connections.

**Full Website Generation:** Automatically create complete websites by combining available components.

**Additional Themes:** Expand the library of component designs.

**More Frameworks:** Add support for additional frameworks and technologies.


## 🛠️ **Contribution**

We welcome contributions! If you have ideas or improvements, feel free to open an issue or submit a pull request.

## **📞 Support**

Dev.X is developed and maintained by DevCoreX. For support, suggestions, or contributions:

**Author:** DevCoreX

**Email:** devcorexofficial@gmail.com

**GitHub:** DevCoreXOfficial

---

## **📄 License**

This project is licensed under the MIT License. See the LICENSE file for details.

---

DevCoreX
Bringing efficiency to web development.
