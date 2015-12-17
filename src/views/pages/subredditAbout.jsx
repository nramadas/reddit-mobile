import React from 'react';
import process from 'reddit-text-js';

import formatNumber from '../../lib/formatNumber';

import BasePage from './BasePage';
import Loading from '../components/Loading';
import TopSubnav from '../components/TopSubnav';

class SubredditAboutPage extends BasePage {
  get track () {
    return 'subreddit';
  }

  render() {

    if (!this.state.loaded || !this.state.data.subreddit) {
      return (
        <Loading />
      );
    }

    var props = this.props;

    var htmlDump;
    var data = this.state.data.subreddit;

    htmlDump = [
      <ul className='subreddit-about-numbers' key='subreddit-about-numbers'>
        <li>{ `${formatNumber(data.subscribers)} readers` }</li>
        <li>{ `${formatNumber(data.accounts_active)} users here now` }</li>
      </ul>,
      <div
        className='subreddit-about-rules'
        key='subreddit-about-rules'
        dangerouslySetInnerHTML={ { __html: process(data.description) } }
      />,
    ];

    return (
      <div className='subreddit-about-main'>
        <TopSubnav
          { ...props }
          user={ this.state.data.user }
          subreddit={ this.state.data.subreddit }
          hideSort={ true }
        />

        <div className='container' key='container'>
          { htmlDump }
        </div>
      </div>
    );
  }
}

SubredditAboutPage.propTypes = {
  // apiOptions: React.PropTypes.object,
  subredditName: React.PropTypes.string.isRequired,
};

export default SubredditAboutPage;
