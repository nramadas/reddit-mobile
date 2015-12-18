import React from 'react';

import constants from '../../constants';
import propTypes from '../../propTypes';

import BaseComponent from './BaseComponent';
import OverlayMenu from './OverlayMenu';
import { LinkRow, ExpandoRow } from './OverlayMenuRow';
import CommunitySearchRow from './CommunitySearchRow';

class CommunityOverlayMenu extends BaseComponent {
  numCommunitiesText(subscriptions) {
    const num = subscriptions.length;
    if (num > 1) {
      return `${num} Communities`;
    } else if (num == 1) {
      return '1 Community';
    }
    return 'No Communities';
  }

  render() {
    const { user, subscriptions, app } = this.props;

    let followingRow;
    if (subscriptions) {
      followingRow =  (
        <ExpandoRow
          icon={ 'icon-settings' }
          text={ 'Following' }
          subtext={ this.numCommunitiesText(subscriptions) }
        >
          { subscriptions.map((subreddit) => {
            return (
              <LinkRow
                key={ `OverlayMenu-row-subscription-${subreddit.url}` }
                href={ subreddit.url }
                icon='OverlayMenu-icon-following-snoo'
                text={ subreddit.display_name }
              />
            ); }) }
        </ExpandoRow>
      );
    }

    return (
      <OverlayMenu
        app={ app }
        openedOnEventName={ constants.TOP_NAV_COMMUNITY_CLICK }
        firesEventName={ constants.COMMUNITY_MENU_TOGGLE }
      >
        <CommunitySearchRow app={ app }/>
        <LinkRow
          text={ `${user ? 'My ' :''}Front Page` }
          href='/'
          icon='icon-snoo-circled icon-xl orangered'
        />
        <LinkRow
          text='Popular'
          href='/r/all'
          icon='icon-bar-chart orangered-circled-xl'
        />
        { followingRow }
      </OverlayMenu>
    );
  }

  static propTypes = {
    user: propTypes.user,
    subscriptions: propTypes.subscriptions,
  }
}

export default CommunityOverlayMenu;
