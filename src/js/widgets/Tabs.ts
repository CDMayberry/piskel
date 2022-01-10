module pskl {
  export module widgets {

    export class Tabs {
      tabs: any;
      parentController: any;
      settingsName: any;
      currentTab: any;
      currentController: any;
      tabListEl: any;
      tabContentlEl: any;
      constructor(tabs, parentController, settingsName) {
        this.tabs = tabs;
        this.parentController = parentController;
        this.settingsName = settingsName;

        this.currentTab = null;
        this.currentController = null;
      }

      init(container) {
        this.tabListEl = container.querySelector('.tab-list');
        this.tabContentlEl = container.querySelector('.tab-content');
        pskl.utils.Event.addEventListener(this.tabListEl, 'click', this.onTabsClicked_, this);

        var tab = pskl.UserSettings.get(this.settingsName);
        if (tab) {
          this.selectTab(tab);
        }
      }

      destroy() {
        if (this.currentController) {
          this.currentController.destroy();
        }
        pskl.utils.Event.removeAllEventListeners(this);
      }

      selectTab(tabId) {
        if (!this.tabs[tabId] || this.currentTab == tabId) {
          return;
        }

        if (this.currentController) {
          this.currentController.destroy();
        }

        this.tabContentlEl.innerHTML = pskl.utils.Template.get(this.tabs[tabId].template);
        this.currentController = new this.tabs[tabId].controller(pskl.app.piskelController, this.parentController);
        this.currentController.init();
        this.currentTab = tabId;
        pskl.UserSettings.set(this.settingsName, tabId);

        var selectedTab = this.tabListEl.querySelector('.selected');
        if (selectedTab) {
          selectedTab.classList.remove('selected');
        }
        this.tabListEl.querySelector('[data-tab-id="' + tabId + '"]').classList.add('selected');
      }
      onTabsClicked_(e) {
        var tabId = pskl.utils.Dom.getData(e.target, 'tabId');
        this.selectTab(tabId);
      }
    }
  }
}