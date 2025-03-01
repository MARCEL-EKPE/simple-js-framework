// SimpleFramework Class
class SimpleFramework {
    constructor(data) {
      this.data = this.makeReactive(data); 
      this.bindings = {}; // Store bindings between data keys and DOM elements
    }
  
    // Make data reactive using Proxy
    makeReactive(data) {
      const self = this;
      return new Proxy(data, {
        set(target, key, value) {
          target[key] = value;
          console.log(`Data updated: ${key} = ${value}`); // Debugging
          self.updateDOM(key); // Update the DOM for this key
          return true;
        },
      });
    }
  
    // Bind a data key to a DOM element
    bind(selector, key) {
      // Initialize array if it doesn't exist
      this.bindings[key] = this.bindings[key] || [];

      // Add the selector to the bindings array
      this.bindings[key].push(selector);
    
      // Update the DOM with the initial value
      this.updateDOM(key);
    
      // Set up two-way binding for input elements
      const element = document.querySelector(selector);
      if (element?.tagName === 'INPUT') {
        element.addEventListener('input', (e) => {
          this.data[key] = e.target.value; // Update the data object
        });
      }
    }
  
    // Update all DOM elements bound to a specific key
    updateDOM(key) {
      if (!this.bindings[key]) return;
    
      this.bindings[key].forEach((selector) => {
        const element = document.querySelector(selector);
        if (!element) {
          console.error(`Element not found: ${selector}`);
          return;
        }
    
        // Update the element based on its type
        if (element.tagName === 'INPUT') {
          element.value = this.data[key]; // Update input value
        } else {
          element.textContent = this.data[key]; // Update text content
        }
      });
    }
  }
  
  // Component Class
  class Component {
    constructor(selector, template, data) {
      this.selector = selector; // Selector for rendering
      this.template = template; // HTML template with placeholders
      this.data = data; // Data object
      this.element = document.querySelector(selector); // Target container
      this.render(); // Render the component on initialization
    }
  
    // Render the component to the DOM
    render() {
      if (!this.element) {
        console.error(`Component target not found: ${this.selector}`);
        return;
      }
      // Replace placeholders (e.g., {{ message }}) with data values
      this.element.innerHTML = this.template.replace(/{{(.*?)}}/g,(_, key) => this.data[key.trim()]);
    }
    
    // Bind a DOM event to a method in the component
    on(event, selector, callback) {
      const element = this.element.querySelector(selector);
      if (element) {
        element.addEventListener(event, callback.bind(this)); // Bind the callback to the component context
      } else {
        console.error(`Element not found: ${selector}`);
      }
    }
  }
  
  // Initialize the framework with some data
  const app = new SimpleFramework({
    message: 'My Simple Javascript Framework!',
    count: 1000,
    inputValue: 'Type something...',
  });
  // Define a template with placeholders for data
  const template = `
    <div>
      <p id="msg">{{ message }}</p>
      <p id="counter">Count: {{ count }}</p>
      <h4 id="inputValueDisplay">{{ inputValue }}</h4>
      <input id="inputField" type="text" placeholder="Enter text" />
      <button id="increment">Increment</button>
    </div>
  `;
  
  // Create a component inside #app
  const component = new Component('#app', template, app.data);
  
  // Bind DOM events to component methods
  component.on('click', '#increment', function () {
    app.data.count++; // Update the reactive data
  });
  
  // Bind data keys to DOM selectors
  app.bind('#msg', 'message');
  app.bind('#counter', 'count');
  app.bind('#inputField', 'inputValue'); 
  app.bind('#inputValueDisplay', 'inputValue'); 
