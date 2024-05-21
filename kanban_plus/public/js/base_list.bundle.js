frappe.provide("frappe.views");



frappe.views.BaseList = class BaseList extends frappe.views.BaseList {


	

	setup_view_menu() {
		// TODO: add all icons
		const icon_map = {
			Image: "image-view",
			List: "list",
			Report: "small-file",
			Calendar: "calendar",
			Gantt: "gantt",
			Kanban: "kanban",
			Dashboard: "dashboard",
            KanbanPlus: "kanban",
			Map: "map",
		};

		if (frappe.boot.desk_settings.view_switcher && !this.meta.force_re_route_to_default_view) {
			/* @preserve
			for translation, don't remove
			__("List View") __("Report View") __("Dashboard View") __("Gantt View"),
			__("Kanban View") __("Calendar View") __("Image View") __("Inbox View"),
			__("Tree View") __("Map View"), __("KanbanPlus")  */
			this.views_menu = this.page.add_custom_button_group(
				__("{0} View", [this.view_name]),
				icon_map[this.view_name] || "list"
			);
			this.views_list = new frappe.views.ListViewSelect({
				doctype: this.doctype,
				parent: this.views_menu,
				page: this.page,
				list_view: this,
				sidebar: this.list_sidebar,
				icon_map: icon_map,
			});
		}
	}


};

// utility function to validate view modes
frappe.views.view_modes = [
	"List",
	"Report",
	"Dashboard",
    "KanbanPlus",
	"Gantt",
	"Kanban",
	"Calendar",
	"Image",
	"Inbox",
	"Tree",
	"Map",
];
frappe.views.is_valid = (view_mode) => frappe.views.view_modes.includes(view_mode);
