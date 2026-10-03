/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// AER Startup — точка входа кастомного UI.
// Подключается через патч browser.xhtml: window listener на MozBeforeInitialXULLayout.
// Держим минимально: перестройка тулбара + загрузка темы, чтобы не ломаться при обновлении Firefox.

export class AerStartup {
  static async init(window) {
    const doc = window.document;
    if (doc.documentElement.hasAttribute("aer-init")) {
      return;
    }
    doc.documentElement.setAttribute("aer-init", "true");
    doc.documentElement.setAttribute("aer-theme", "dark");

    try {
      // Пример кастомного UI: контейнер под вертикальные табы (MVP-заглушка).
      // Полноценный vertical tabs / workspaces докрутим следующими итерациями.
      this._ensureSidebarContainer(window);
    } catch (e) {
      console.error("[aer] startup failed:", e);
    }
  }

  static _ensureSidebarContainer(window) {
    const doc = window.document;
    if (doc.getElementById("aer-sidebar-container")) {
      return;
    }
    const toolbox = doc.getElementById("navigator-toolbox");
    if (!toolbox) {
      return;
    }
    const container = doc.createXULElement("vbox");
    container.id = "aer-sidebar-container";
    container.setAttribute("data-aer", "sidebar-mvp");
    toolbox.after(container);
  }
}
