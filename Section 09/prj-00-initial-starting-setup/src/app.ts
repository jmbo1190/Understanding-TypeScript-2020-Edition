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

// Darg & Drop Interfaces
interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}


// Generic Listener
type Listener<T> =  (projects: T[]) => void; // NOT: type Listener<T> =  (projects: <T>[]) => void;

// (reusable) State class with generic Listeners
class State<T> {
    protected listeners: Listener<T>[] = [];  // cannot be private as need to be accessed from derived classes

    protected constructor(){  // cannot be private as need to be accessed from derived classes
        
    }

    addListener(listenerFn: Listener<T>){
        this.listeners.push(listenerFn);
    }
}

// Project State Management - singleton pattern
class ProjectState extends State<Project>{
    private projects: Project[] = [];
    private static instance: ProjectState;
    // private listeners: Listener<Project>[] = [];  // Now defined in Base Class

    private constructor(){
        super();
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
            'proj-ID'+Math.random().toString(),
            title,
            description,
            people,
            ProjectStatus.Active
        )        
        this.projects.push(newProject);
        this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const selectedProject = this.projects.find(prj => prj.id === projectId);
        if (selectedProject
            && newStatus !== selectedProject.status // avoid unnecessary re-renders
        ){
            selectedProject.status = newStatus;
            this.updateListeners();
        }
    }

    updateListeners() {
        for (const listener of this.listeners) {
            listener(this.projects.slice()); // slice returns a copy rather than a reference
        }
    }
    // Now defined in Base Class:
    // addListener(listenerFn: Listener<Project>){
    //     this.listeners.push(listenerFn);
    // }
}

const globalProjectState = ProjectState.getInstance();


// Component Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T; // e.g. HTMLDivElement;
    element: U;     // e.g. HTMLElement;

    constructor (
           templateElementId: string // e.g. 'project-list'
        ,  hostElementId: string     // e.g. 'app'
        ,  insertFirst: boolean      // true: insertAdjacentElement 'afterbegin' / false: 'beforeend'
        ,  elementId?: string        // e.g. 'active-projects', 'finished-projects' or 'user-input'
    ) {
        this.templateElement = document.getElementById(templateElementId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T; // e;g. HTMLDivElement;
        // Not: firstChild (could be an element, comment or text node),
        // but firstElementChild (ensures this will be an element node)!
        //   const importedNode = document.importNode(this.templateElement.content, true);  // DocumentFragment
        //   this.element = importedNode.firstElementChild as HTMLElement;
        //   console.log('importedNode.firstElementChild:', importedNode.firstElementChild); // <section> element
        //   console.log('importedNode.firstChild:', importedNode.firstChild); // text note with only spaces
        this.element = document
            .importNode(this.templateElement.content, true)
            .firstElementChild as U; // e.g. HTMLElement;
        if (elementId) {
            this.element.id = elementId;
        }
        this.attach(insertFirst);
    }

    private attach(insertFirst: boolean) {
        this.hostElement
            .insertAdjacentElement(insertFirst ? 'afterbegin' : 'beforeend'
                , this.element as Element);
    }
}

// ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    get persons () {
        console.log('(get persons): this.project:', this.project)
        if (! this.project.people) return "???";
        if (this.project.people === 1) return "1 person";
        return `${this.project.people} persons`;
    }

    constructor(hostElementId: string , project: Project){
        super('single-project', hostElementId, false, project.id);
        this.project = project;
        this.configure();
        this.render();
    }

    @autobind   // make 'this' refer to ProjectItem rather than to the HTML List Item Element that is the event target
    dragStartHandler(event: DragEvent) {
        console.log(event);
        console.log('event.target:', event.target);
        console.log('this:', this);
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = "move";
    }

    @autobind
    dragEndHandler(_event: DragEvent) {
        console.log("dragend");
    }

    private configure(){
        this.element.draggable = true;
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
        if (! this.element.querySelector('h2')) {
            const titleElem = document.createElement('h2');
            this.element.appendChild(titleElem);
        }
        if (! this.element.querySelector('h3')) {
            const peopleElem = document.createElement('h3');
            this.element.appendChild(peopleElem);
        }
        if (! this.element.querySelector('p')) {
            const descrElem = document.createElement('p');
            this.element.appendChild(descrElem);
        }
    }
    
    private render(){
        const titleElem = this.element.querySelector('h2')! as HTMLHeadingElement;
        titleElem.textContent = this.project.title;
        const peopleElem = this.element.querySelector('h3')! as HTMLHeadingElement;
        peopleElem.textContent = 'xxx';
        const persons = this.persons;
        peopleElem.textContent = `${persons} assigned`;
        const descrElem = this.element.querySelector('p')! as HTMLParagraphElement;
        descrElem.textContent = this.project.description;
    }

}

// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`);
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
        this.populate();
    }

    @autobind
    dragOverHandler(event: DragEvent){
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();  // required to allow drop
            this.element.classList.add('droppable');
        }
    }

    @autobind
    dragLeaveHandler(_event: DragEvent){
        this.element.classList.remove('droppable');
    }

    @autobind
    dropHandler(event: DragEvent) {
        console.log('(dropHandler) event.dataTransfer!.getData(\'text/plain\'):', 
            event.dataTransfer!.getData('text/plain'));
        const projId = event.dataTransfer!.getData('text/plain');
        globalProjectState.moveProject(projId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
        this.element.classList.remove('droppable');
    }

    private populate() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        console.log('ProjectList.populate() Id:', this.element.id);
        this.element.querySelector('ul')!.id = `${this.type}-projects-list`;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects() {
        const listElem = this.element.querySelector(`#${this.type}-projects-list`)! as HTMLUListElement;
        listElem.innerHTML = ''; // remove previous content if any - avoids duplication
        for (const prj of this.assignedProjects){
            // const prjElem = document.createElement('li');
            // prjElem.textContent = prj.title;
            // listElem.appendChild(prjElem);
            new ProjectItem(`${this.type}-projects-list`, prj);
        }
    }

}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
    console.log("formElement:", this.element);

    this.configure();
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
      this.element.addEventListener(
        "submit",
        this.submitHandler.bind(this)
      );
    } else {
      // Using autobind decorator as an alternative
      this.element.addEventListener("submit", this.submitHandler);
    }
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
