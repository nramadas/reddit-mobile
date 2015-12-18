export default {
  TOGGLE_OVER_18: 'toggleOver18',
  USER_MENU_TOGGLE: 'sideNavToggle',
  COMMUNITY_MENU_TOGGLE: 'communityMenuToggle',
  TOP_NAV_HAMBURGER_CLICK: 'topNavHamburgerClick',
  TOP_NAV_COMMUNITY_CLICK: 'topNavCommunityClick',
  USER_DATA_CHANGED: 'userDataChanged',
  VOTE: 'vote',
  OVERLAY_MENU_OPEN: 'overlayMenuOpen',
  OVERLAY_MENU_OFFSET: -10, // from css
  DROPDOWN_CSS_CLASS: 'Dropdown',
  DROPDOWN_OPEN: 'dropdownOpen',
  COMPACT_TOGGLE: 'compactToggle',
  TOP_NAV_HEIGHT: 45,
  RESIZE: 'resize',
  SCROLL: 'scroll',
  ICON_SHRUNK_SIZE: 16,
  CACHEABLE_COOKIES: ['compact'],
  DEFAULT_API_TIMEOUT: 10000,
  HIDE_GLOBAL_MESSAGE: 'hideGlobalMessage',
  // number of views before we hide stop showing EU cookie notice,
  // or when user clicks close.
  EU_COOKIE_HIDE_AFTER_VIEWS: 3,
  NEW_INFOBAR_MESSAGE: 'newInfoBarMessage',
  messageTypes: {
    GLOBAL: 'global',
    EU_COOKIE: 'euCookie',
  },
};
