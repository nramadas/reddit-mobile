import React from 'react';
import constants from '../../constants';
import propTypes from '../../propTypes';
import { models } from 'snoode';

import formatNumber from '../../lib/formatNumber';

import BaseComponent from './BaseComponent';

const UTF8Circle = '●';

class CommunityHeader extends BaseComponent {
  constructor(props) {
    super(props);

    this.state.subreddit = props.subreddit;
    this._onSubscribeToggle = this._onSubscribeToggle.bind(this);
  }

  render() {
    if (!this.state.subreddit) {
      return false;
    }

    const subreddit = this.state.subreddit;
    const subscriber = subreddit.user_is_subscriber;

    let onlineCount;
    if (subreddit.accounts_active) {
      onlineCount = ` ${UTF8Circle} ${formatNumber(subreddit.accounts_active)} online`;
    }

    const followIcon = subscriber ? 'icon-clear' : 'icon-follow' ;

    return (
      <div className='CommunityHeader'>
        <div className='CommunityHeader-banner'>
          <div className='CommunityHeader-banner-icon-holder' />
        </div>
        <div className='CommunityHeader-text-row'>
          <h4 className='CommunityHeader-community-title'>
            { subreddit.display_name }
          </h4>

        </div>
        <div className='CommunityHeader-text-row'>
          <span>{ `${formatNumber(subreddit.subscribers)} followers` }</span>
          { onlineCount }
          { ` ${UTF8Circle}` }
          <span className='CommunityHeader-text-row-blue'>
            { ` ${subscriber ? 'Unfollow' : 'Follow'} ` }
            <button
              className='CommunityHeader-subscribe-button'
              onClick={ this._onSubscribeToggle }
            >
              <span
                className={ `CommunityHeader-subscribe-icon blue ${ followIcon}` }
              />
            </button>
          </span>
        </div>
      </div>
    );
  }

  _toggleSubredditSubscribedState() {
    const subreddit = this.state.subreddit;
    this.setState({subreddit: {...subreddit, user_is_subscriber: !subreddit.user_is_subscriber}});
  }

  _onSubscribeToggle() {
    if (!this.props.token) {
      this.props.app.redirect('/register');
      return;
    }

    const subreddit = this.state.subreddit;
    const props = this.props;

    const subscription = new models.Subscription({
      action: subreddit.user_is_subscriber ? 'unsub' : 'sub',
      sr: subreddit.name,
    });

    const options = {
      ...this.props.apiOptions,
      model: subscription,
      id: subreddit.id,
    };

    // toggle the ui for now while we post the request
    this._toggleSubredditSubscribedState();

    props.app.api.subscriptions.post(options)
      .then(function (data) {
        // if it fails revert back to the original state
        if (Object.keys(data).length) {
          this._toggleSubredditSubscribedState();
          this.props.app.render('/400', false);
        } else {
          this.props.app.emit(constants.USER_DATA_CHANGED);
        }
      }.bind(this));
  }

  static propTypes = {
    subreddit: propTypes.subreddit,
  }
}

export default CommunityHeader;
