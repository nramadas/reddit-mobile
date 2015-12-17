import React from 'react';
import cookies from 'cookies-js';

import constants from '../../constants';
import propTypes from '../../propTypes';
import BaseComponent from './BaseComponent';

import titleCase from '../../lib/titleCase';

import OverlayMenu from './OverlayMenu';
import { LinkRow, ButtonRow, ExpandoRow } from './OverlayMenuRow';

import menuItems from '../../userOverlayMenuItems';

const userIconClassName = 'icon-user-account icon-large blue';

class UserOverlayMenu extends BaseComponent {
  constructor(props) {
    super(props);

    this.state.compact = props.compact;

    this._viewPreferenceToggleClick = this._viewPreferenceToggleClick.bind(this);
    this._gotoDesktopSiteClick = this._gotoDesktopSiteClick.bind(this);
  }

  loggedInUserRows(user) {
    const inboxCount = user.inbox_count;
    let badge;
    let newMailClass;

    if (inboxCount) {
      badge = (
        <span className='badge badge-orangered badge-with-spacing'>
          { inboxCount }
        </span>
      );
      newMailClass = 'text-orangered';
    }

    return [
      <LinkRow
        key='account'
        text={ user.name }
        href={ `/u/${user.name}` }
        icon={ userIconClassName }
      >
        <a className='OverlayMenu-row-right-item' href='/logout' data-no-route={ true }>
          Log out
        </a>
      </LinkRow>,

      <LinkRow
        key='inbox'
        text={['Inbox', badge]}
        href='/message/inbox'
        icon={ 'icon-message icon-large orangered' }
      />,

      <LinkRow
        key='saved'
        text={ 'Saved' }
        href={ `/u/${user.name}/saved` }
        icon={ 'icon-save icon-large lime' }
      />,

      <LinkRow
        key='settings'
        text= { 'Settings' }
        href={ `${this.props.config.reddit}/prefs` }
        icon={ 'icon-settings icon-large blue ' }
      />,
    ];
  }

  render() {
    const { user, config } = this.props;
    const compact = this.state.compact;
    let userBasedRows;

    if (user) {
      userBasedRows = this.loggedInUserRows(user);
    } else {
      userBasedRows =
        <LinkRow noRoute={ true }
          text={ 'Log in / sign up' }
          icon={ userIconClassName }
          href={ this.props.app.config.loginPath } />;
    }

    return (
      <OverlayMenu app={ this.props.app }
          openedOnEventName={ constants.TOP_NAV_HAMBURGER_CLICK }
          firesEventName={ constants.USER_MENU_TOGGLE } >

        { userBasedRows }

        <ButtonRow
          icon={ 'icon-compact icon-large blue' }
          text={ `${compact ? 'List' : 'Compact'} view` }
          clickHandler={ this._viewPreferenceToggleClick } />

        <LinkRow
          icon={ 'icon-desktop icon-large blue' }
          text={ 'Desktop Site'}
          href={ `https://www.reddit.com${this.props.ctx.url}` }
          clickHandler={ this._desktopSite }/>

        <ExpandoRow icon='icon-info icon-large' text='About Reddit'>
          { menuItems.aboutItems.map((item) => {
              return (
                <LinkRow
                  href={ `${config.reddit}${item.url}` }
                  key = { item.url }
                  text={ titleCase(item.title) }
                />);
          })}
        </ExpandoRow>

        <ExpandoRow icon='icon-rules icon-large' text='Reddit Rules'>
          { menuItems.ruleItems.map((item) => {
              return (
                <LinkRow
                  href={ `${config.reddit}${item.url}` }
                  key={ item.url }
                  text={ titleCase(item.title) }
              />);
          })}
        </ExpandoRow>
      </OverlayMenu>
    );
  }

  _viewPreferenceToggleClick() {
    const {app, config } = this.props;
    const compact = this.state.compact;

    if (compact) {
      cookies.expire('compact');
    } else {
      let date = new Date();
      date.setFullYear(date.getFullYear() + 2);

      cookies.set('compact', true, {
        expires: date,
        secure: config.https || config.httpsProxy,
      });
    }

    const newCompact = !compact;
    app.emit(constants.COMPACT_TOGGLE, newCompact);

    // TODO hacky, fix this latedr
    app.emit(constants.TOP_NAV_HAMBURGER_CLICK);
    this.setState({compact: newCompact});
  }

  _gotoDesktopSiteClick(e) {
    e.preventDefault();
    const url = this.props.ctx.url;
    let query = '';

    if (Object.keys(this.props.ctx.query).length > 0) {
      query = '?' + querystring.stringify(this.props.ctx.query || {});
    }

    this.props.app.emit('route:desktop', `${url}${query}`);
  }

  static propTypes = {
    compact: React.PropTypes.bool.isRequired,
    user: propTypes.user,
  }
}

export default UserOverlayMenu;
