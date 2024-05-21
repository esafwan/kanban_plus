// public/js/kanbanplus.js

frappe.pages['kanbanplus'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Kanban Plus',
        single_column: true
    });

    // Create a container for the Vue app
    let container = $('<div id="app"></div>').appendTo(page.main);
 
	// Expose Frappe to the window object
	window.frappe = frappe;
	
    // Initialize Vue.js application 
	const script = document.createElement('script');
	script.src = '/assets/kanban_plus/js/kanbanplus.js';	
	document.head.appendChild(script);
    
};
