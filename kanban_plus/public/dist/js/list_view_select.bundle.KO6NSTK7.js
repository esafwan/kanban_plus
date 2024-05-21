(() => {
  // ../kanban_plus/kanban_plus/public/js/list_view_select.bundle.js
  frappe.provide("frappe.views");
  frappe.views.ListViewSelect = class ListViewSelect extends frappe.views.ListViewSelect {
    setup_views() {
      const views = {
        List: {
          condition: true,
          action: () => this.set_route("list")
        },
        Report: {
          condition: true,
          action: () => this.set_route("report"),
          current_view_handler: () => {
            const reports = this.get_reports();
            let default_action = {};
            if (frappe.get_route().length > 3) {
              default_action = {
                label: __("Report Builder"),
                action: () => this.set_route("report")
              };
            }
            this.setup_dropdown_in_sidebar("Report", reports, default_action);
          }
        },
        Dashboard: {
          condition: true,
          action: () => this.set_route("dashboard")
        },
        Calendar: {
          condition: frappe.views.calendar[this.doctype],
          action: () => this.set_route("calendar", "default"),
          current_view_handler: () => {
            this.get_calendars().then((calendars) => {
              this.setup_dropdown_in_sidebar("Calendar", calendars);
            });
          }
        },
        Gantt: {
          condition: frappe.views.calendar[this.doctype],
          action: () => this.set_route("gantt")
        },
        Inbox: {
          condition: this.doctype === "Communication" && frappe.boot.email_accounts.length,
          action: () => this.set_route("inbox"),
          current_view_handler: () => {
            const accounts = this.get_email_accounts();
            let default_action;
            if (has_common(frappe.user_roles, ["System Manager", "Administrator"])) {
              default_action = {
                label: __("New Email Account"),
                action: () => frappe.new_doc("Email Account")
              };
            }
            this.setup_dropdown_in_sidebar("Inbox", accounts, default_action);
          }
        },
        Image: {
          condition: this.list_view.meta.image_field,
          action: () => this.set_route("image")
        },
        Tree: {
          condition: frappe.treeview_settings[this.doctype] || frappe.get_meta(this.doctype).is_tree,
          action: () => this.set_route("tree")
        },
        Kanban: {
          condition: this.doctype != "File",
          action: () => this.setup_kanban_boards(),
          current_view_handler: () => {
            frappe.views.KanbanView.get_kanbans(this.doctype).then(
              (kanbans) => this.setup_kanban_switcher(kanbans)
            );
          }
        },
        KanbanPlus: {
          condition: this.doctype != "File",
          action: () => this.setup_kanban_boards(),
          current_view_handler: () => {
            frappe.views.KanbanView.get_kanbans(this.doctype).then(
              (kanbans) => this.setup_kanban_switcher(kanbans)
            );
          }
        },
        Map: {
          condition: this.list_view.settings.get_coords_method || this.list_view.meta.fields.find((i) => i.fieldname === "latitude") && this.list_view.meta.fields.find((i) => i.fieldname === "longitude") || this.list_view.meta.fields.find(
            (i) => i.fieldname === "location" && i.fieldtype == "Geolocation"
          ),
          action: () => this.set_route("map")
        }
      };
      frappe.views.view_modes.forEach((view) => {
        if (this.current_view !== view && views[view].condition) {
          this.add_view_to_menu(view, views[view].action);
        }
        if (this.current_view == view) {
          views[view].current_view_handler && views[view].current_view_handler();
        }
      });
    }
  };
})();
//# sourceMappingURL=list_view_select.bundle.KO6NSTK7.js.map
