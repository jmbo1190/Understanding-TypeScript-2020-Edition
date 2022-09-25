# To start a project

* create file `index.html`; 
    * in editor, enter abbreviation: `html:5` (press `Ctrl+Space` if needed to see the abbreviation options) and press `Tab` to expand into a base html5 skeleton.
    * in `<head>`, add tagg `<script>` with `src="app.js"` and `defer`.

* create file `app.ts` with some basic content e.g. `console.log("Hello");`

* in terminal, compile the .ts file with: 
   `tsc app.ts`

* load `index.html` in the browser and open the _Developer Tools_

* To have the page refreshed automatically in the browser when some changes are made, install the following tool:
  * __initialize npm__ (available after installing node.js) in the project folder with: `npm init` (accept all defaults by pressing ENTER all the time).  This generates a `package.json` file.
  * after this, install a development tool dependenciy with: `npm install --save-dev lite-server`.  This adds a dependency to '**lite-server**' in the package.json file, which generates a simple development server that always serves the index.html file next to the package.json file, by default on http://localhost:3000, and automatically reloads the page whenever a file in that directory changes.
  * In package.json, add under "scripts" a line with `"start": "lite-server"`
  * in terminal, enter `npm start` to start this script; to stop the server press `Ctrl+C` in the terminal where it was started.

  * to have each file in a project folder recompiled as soon as it changes:
    * one-time action: initialize that folder by running the command `tsc --init` in that folder.  This creates a file `tsconfig.json` in that folder.
    * after that it is possible to run just `tsc` in order to have all .ts files in the project folder (re-)compiled.
    * in order to recompile any of those .ts files that chnages, `tsc` can be called in **watch mode** with: `tsc --watch` or `tsc -w`.


