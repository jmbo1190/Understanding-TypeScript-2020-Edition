class ProjectInput {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    formElement: HTMLFormElement;

    constructor() {
        this.templateElement = document.getElementById("project-input") as HTMLTemplateElement;
        this.hostElement = document.getElementById("app") as HTMLDivElement;
        console.log('templateElement:', this.templateElement);
        const importedNode = document.importNode(this.templateElement.content, true) as DocumentFragment;
        console.log('importedNode:', importedNode);
        this.formElement = importedNode.firstElementChild as HTMLFormElement;
        console.log('formElement:', this.formElement);
        this.render();
    }

    render(){
        this.hostElement.insertAdjacentElement("afterbegin", this.formElement) as HTMLFormElement;
    }
}

const prjInput = new ProjectInput();