// Validation

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatable: Validatable) {
    let isValid = true;
    if (validatable.required && validatable.value.toString().trim().length === 0) {
        console.log('required:', validatable.required);
        isValid = false;
    }
    if (
        validatable.minLength != null &&
        validatable.value.toString().trim().length < validatable.minLength
    ) {
        console.log('minLength:', validatable.minLength);
        isValid = false;
    }
    if (
        validatable.maxLength != null &&
        validatable.value.toString().trim().length > validatable.maxLength
        ) {
            console.log('maxLength:', validatable.maxLength);
            isValid = false;
        }
    if (
        validatable.min != null &&
        +validatable.value < validatable.min
    ) {
        console.log('min:', validatable.min);
        isValid = false;
    }
    if (
        validatable.max != null &&
        +validatable.value > validatable.max
    ) {
        console.log('max:', validatable.max);
        isValid = false;
    }
        
  return isValid;
}

// autobind method decorator
function autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  console.log("(autobind) target", target);
  console.log("(autobind) methodName", methodName);
  console.log("(autobind) desciptor", descriptor);
  const originalMethod = descriptor.value;
  const adjustedDescriptor = {
    configurable: true,
    get() {
      const boundMethod = originalMethod.bind(this);
      return boundMethod;
    },
  };
  return adjustedDescriptor;
}

// Project Status
enum ProjectStatus { Active, Finished };

// Project
class Project {
    constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) {
    }
}

// Listener
type Listener =  (projects: Project[]) => void;

// Project State Management - singleton pattern
class ProjectState {
    private projects: Project[] = [];
    private static instance: ProjectState;
    private listeners: Listener[] = [];

    private constructor(){
        
    }

    static getInstance(){
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title: string, description: string, people: number){
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            people,
            ProjectStatus.Active
        )        
        this.projects.push(newProject);
        for (const listener of this.listeners) {
            listener(this.projects.slice()); // slice returns a copy rather than a reference
        }
    }

    addListener(listenerFn: Listener){
        this.listeners.push(listenerFn);
    }
}

const globalProjectState = ProjectState.getInstance();



// ProjectList Class
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content, true);  // DocumentFragment
        // Not firstChild (could be an element, comment or text node)
        // but firstElementChild (ensures this will be an element node)!
        console.log('importedNode.firstElementChild:', importedNode.firstElementChild); // <section> element
        console.log('importedNode.firstChild:', importedNode.firstChild); // text note with only spaces
        // this.element = importedNode.firstElementChild as HTMLElement;
        this.element = document.importNode(this.templateElement.content, true).firstElementChild as HTMLElement;
        this.assignedProjects = []; // initialize
        globalProjectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter( prj => {
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })
        this.render();
        this.populate();
    }

    private populate() {
        this.element.id = `${this.type}-projects`;
        console.log('ProjectList.populate() Id:', this.element.id);
        this.element.querySelector('ul')!.id = `${this.type}-projects-list`;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private render() {
        console.log('ProjectList.render() this.element:', this.element);
        this.hostElement.insertAdjacentElement('beforeend', this.element as Element);
    }

    private renderProjects() {
        const listElem = this.element.querySelector(`#${this.type}-projects-list`)! as HTMLUListElement;
        listElem.innerHTML = ''; // remove previous content if any - avoids duplication
        for (const prj of this.assignedProjects){
            const prjElem = document.createElement('li');
            prjElem.textContent = prj.title;
            listElem.appendChild(prjElem);
        }
    }

}

// ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    ) as HTMLTemplateElement;
    this.hostElement = document.getElementById("app") as HTMLDivElement;
    console.log("templateElement:", this.templateElement);
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    ) as DocumentFragment;
    console.log("importedNode:", importedNode);
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = "user-input";
    this.titleInputElement = this.formElement.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector(
      "#people"
    ) as HTMLInputElement;
    console.log("formElement:", this.formElement);
    // console.log('formElement.parentElement:', this.formElement.parentElement); // null

    this.configure();
    this.render();
  }

  @autobind // decorator will automatically add .bind(this) on decorated method
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log("(sumitHandler) this:", this);
    if (this instanceof HTMLFormElement) {
      // when this.submitHandler is added as event listern without .bind(this)
      console.log(
        "(sumitHandler without .bind(this)) this.parentElement:",
        this.parentElement
      ); // div
    }
    if (this instanceof ProjectInput) {
      // when this.submitHandler is added as event listern with .bind(this)
      console.log(
        "(sumitHandler with .bind(this)) this.titleInputElement.value:",
        this.titleInputElement.value
      );
    }
    const userInput = this.gatherUserInput();
    if (userInput) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      globalProjectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    // Bound functions usually have a name that start with 'bound ' + original function name
    console.log("(configure) submitHandler.name:", this.submitHandler.name);
    if (!/^bound /.test(this.submitHandler.name)) {
      // Using .bind(this) so in submitHandler `this` will refer to the ProjectInput class instance
      // instead of refering to the event target (i.e. the Form element)
      this.formElement.addEventListener(
        "submit",
        this.submitHandler.bind(this)
      );
    } else {
      // Using autobind decorator as an alternative
      this.formElement.addEventListener("submit", this.submitHandler);
    }
  }

  private render() {
    this.hostElement.insertAdjacentElement(
      "afterbegin",
      this.formElement
    ) as HTMLFormElement;
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;
    // validate inputs
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
      minLength: 1,
      maxLength: 40,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
      maxLength: 400,
    };
    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 8,
    };
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable) ||
      false
    ) {
      alert("Invalid inputs, please try again!");
      return;
    }
    return [enteredTitle, enteredDescription, +enteredPeople];
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }
}

const prjInput = new ProjectInput();
const actPrjList = new ProjectList('active');
const finPrjList = new ProjectList('finished');
