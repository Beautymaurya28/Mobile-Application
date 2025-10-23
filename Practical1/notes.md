Alright — I’ll prepare **clear, practical notes** for you so you can **perform the steps in your practical** and also **answer viva questions** on building & running a basic Angular app.

---

# **📚 Notes — Build & Run a Basic Angular App**

## **1. Introduction**

* **Angular**: A **TypeScript-based** front-end framework for building single-page web applications (SPAs).
* Developed and maintained by **Google**.
* Uses **components**, **templates**, **data binding**, **routing**, and **services**.

---

## **2. Prerequisites**

* **Node.js & npm** (Node Package Manager) installed.
* **Angular CLI** (Command Line Interface) installed.

---

## **3. Check and Install Requirements**

**Check Node.js & npm versions:**

```bash
node -v
npm -v
```

**Install Angular CLI globally:**

```bash
npm install -g @angular/cli
```

**Check Angular CLI version:**

```bash
ng version
```

---

## **4. Create a New Angular Project**

```bash
ng new my-angular-app
```

**CLI Prompts:**

* **Routing** → `Yes` or `No` (Choose `Yes` for practice)
* **Stylesheet format** → Choose `CSS` (for beginners)

---

## **5. Navigate into the Project**

```bash
cd my-angular-app
```

---

## **6. Run the Angular Application**

**Start development server:**

```bash
ng serve
```

Or specify a port:

```bash
ng serve --port 4201
```

**Open in browser:**

```
http://localhost:4200
```

---

## **7. Modify the App Component**

Open:

```
src/app/app.component.html
```

Replace with:

```html
<h1>Hello Angular 🚀</h1>
<p>This is my first Angular app!</p>
```

Changes update automatically via **live reload**.

---

## **8. Stop the Server**

Press:

```
CTRL + C
```

and type `Y` to confirm.

---

## **9. Build for Production**

```bash
ng build
```

* Output stored in the `dist/` folder.

---

## **🔍 Viva Questions & Answers**

**Q1. What is Angular?**
A: Angular is a TypeScript-based framework for building single-page web applications, developed by Google.

**Q2. What is Angular CLI?**
A: A command-line tool to create, build, run, and maintain Angular projects easily.

**Q3. Why do we install Node.js for Angular?**
A: Angular requires Node.js to run build tools, and npm to install dependencies.

**Q4. What is the command to create a new Angular project?**
A: `ng new project-name`

**Q5. How do you run an Angular project?**
A: Using `ng serve` or `npm start`.

**Q6. What is the default port for Angular dev server?**
A: `4200`

**Q7. Where is the main HTML code written in Angular?**
A: In the component’s HTML file, e.g., `app.component.html`.

**Q8. How do you build an Angular app for deployment?**
A: Using `ng build` which creates an optimized build in the `dist/` folder.

**Q9. What is live reload in Angular?**
A: The feature where the browser automatically refreshes when you save changes in code.

**Q10. Can we change Angular’s default port?**
A: Yes, using `ng serve --port PORT_NUMBER`.

---

If you want, I can also make you a **one-page PDF** of these notes so you can keep it handy during practicals and viva prep. That way, you won’t need to open long documents.
