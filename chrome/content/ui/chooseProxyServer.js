/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is AutoProxy.
 *
 * The Initial Developer of the Original Code is
 * Wang Congming <lovelywcm@gmail.com>.
 *
 * Portions created by the Initial Developer are Copyright (C) 2009-2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * ***** END LICENSE BLOCK ***** */

function init()
{
  var rows = document.getElementsByTagName('rows')[0],
  menuIndex = function(proxyValue)
  {
    return (parseInt(proxyValue) + proxy.server.length + 1) % (proxy.server.length + 1);
  };

  // row for setting default proxy
  menu.newList(E('defaultProxy'), prefs.defaultProxy, true);

  // one row per rule group
  for each (let subscription in aup.filterStorage.subscriptions) {
    var row = cE('row');
    var groupName = cE('label');
    row.appendChild(groupName);
    rows.insertBefore( row, E('groupSeparator') );

    groupName.setAttribute('value', subscription.typeDesc + ": " + subscription.title);

    // Parameter given to menu.newList() is to mark this munu item as selected
    menu.newList(row, menuIndex(subscription.proxy));
  }

  // row for setting fallback proxy
  menu.newList(E('fallbackProxy'), menuIndex(prefs.fallbackProxy));
}

var menu =
{
  menuList: null,

  /**
   * Create a menu list with several menu items:
   *   "direct connect" item
   *    ....
   *    several items according to how many proxies
   *    ...
   *   "default proxy" item
   *
   * @param node {DOM node}: which node should this new menu list append to
   * @param index {int}: which menu item should be selected by default
   * @param isDefaultProxyPopup {boolean}: if true, "default proxy" menu item won't be created
   */
  newList: function(node, index, isDefaultProxyPopup)
  {
    this.menuList = cE('menulist');
    this.menuList.appendChild( cE('menupopup') );
    node.appendChild( this.menuList );

    proxy.getName.forEach(this.newItem);

    if (isDefaultProxyPopup)
      this.menuList.firstChild.firstChild.hidden = true;
    else
      this.newItem('默认代理');

    this.menuList.selectedIndex = index;
  },

  /**
   * Create a new menu item for this.menuList
   */
  newItem: function(proxyName)
  {
    var menuItem = cE('menuitem');
    menuItem.setAttribute('label', proxyName);
    menu.menuList.firstChild.appendChild(menuItem);
  }
};

function save()
{
  prefs.defaultProxy = E('defaultProxy').lastChild.selectedIndex;

  var fallbackId = E('fallbackProxy').firstChild.nextSibling.selectedIndex;
  if ( fallbackId == proxy.server.length ) fallbackId = -1;
  prefs.fallbackProxy = fallbackId;

  // other configs are ignored, not implemented yet
  prefs.save();
}
