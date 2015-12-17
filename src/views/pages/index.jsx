import React from 'react';
import constants from '../../constants';
import querystring from 'querystring';

import BasePage from './BasePage';
import ListingContainer from '../components/ListingContainer';
import ListingPaginationButtons from '../components/ListingPaginationButtons';
import Loading from '../components/Loading';
import TopSubnav from '../components/TopSubnav';
import Interstitial from '../components/Interstitial';
import CommunityHeader from '../components/CommunityHeader';

class IndexPage extends BasePage {
  constructor(props) {
    super(props);
    this.state.compact = props.compact;
    this._onCompactToggle = this._onCompactToggle.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.props.app.on(constants.COMPACT_TOGGLE, this._onCompactToggle);
  }

  _onCompactToggle(compact) {
    this.setState({ compact });
  }

  componentWillUnmount() {
    this.props.app.off(constants.COMPACT_TOGGLE, this._onCompactToggle);
  }

  get track () {
    return 'listings';
  }

  render() {
    var loading;
    var props = this.props;
    var { data, compact } = this.state;

    var subredditName = props.subredditName;
    var fakeSubs = ['mod', 'all', 'friends'];
    var isFakeSub = fakeSubs.indexOf(subredditName) !== -1;

    if (!data || !data.listings ||
        (subredditName && (!data.subreddit && !isFakeSub))) {
      return (
        <Loading />
      );
    }

    let bypassInterstitial = data.preferences && data.preferences.over_18;
    if (!bypassInterstitial) {
      if (data.subreddit && data.subreddit.over18 && props.showOver18Interstitial) {
        return (<Interstitial  {...props} loggedIn={ data.preferences } type='over18' />);
      }
    }
    var listings = this.state.data.listings;

    var hideSubredditLabel = props.subredditName &&
                             props.subredditName.indexOf('+') === -1 &&
                             props.subredditName !== 'all';

    var page = props.page || 0;

    var user = this.state.data.user;

    var firstId;
    var lastId;
    let prevUrl;
    let nextUrl;

    var subreddit = '';

    if (props.subredditName) {
      subreddit = '/r/' + props.subredditName;
    }

    if (props.multi) {
      subreddit = '/u/' + props.multiUser + '/m/' + props.multi;
    }

    var sort = props.sort || 'hot';
    var excludedSorts = [];

    if (!props.subredditName || props.multi) {
      excludedSorts.push('gilded');
    }

    if (listings.length) {
      firstId = listings[0].name;
      lastId = listings[listings.length - 1].name;

      if (page > 0) {
        var prevQuery = Object.assign({}, props.ctx.query, {
          count: 25,
          page: page - 1,
          before: firstId,
        });

        prevUrl = subreddit + '?' + querystring.stringify(prevQuery);
      }

      var nextQuery = Object.assign({}, props.ctx.query, {
        count: 25,
        page: page + 1,
        after: lastId,
      });

      nextUrl = subreddit + '?' + querystring.stringify(nextQuery);
    }

    var showAds = !!props.config.adsPath;

    if (props.prefs && props.prefs.hide_ads === true) {
      showAds = false;
    }

    let subredditIsNSFW = data.subreddit ? data.subreddit.over18 : false;

    return (
      <div>
        { loading }

        <CommunityHeader {...props} subreddit={ data.subreddit } />

        <TopSubnav
          { ...props }
          user={ data.user }
          subreddit={ data.subreddit }
          sort={ sort }
          list='listings'
          excludedSorts={ excludedSorts }
        />

        <ListingContainer
          { ...props }
          user={ user }
          showAds={ showAds }
          listings={ listings }
          firstPage={ page }
          page={ page }
          hideSubredditLabel={ hideSubredditLabel }
          subredditTitle={ subreddit }
          subredditIsNSFW={ subredditIsNSFW }
          winWidth={ this.props.ctx.winWidth }
          compact={ compact }
        >
          <ListingPaginationButtons
            compact={ compact }
            prevUrl={ prevUrl }
            nextUrl={ nextUrl }
          />
        </ListingContainer>
      </div>
    );
  }
}

IndexPage.propTypes = {
  before: React.PropTypes.string,
  after: React.PropTypes.string,
  data: React.PropTypes.object,
  multi: React.PropTypes.string,
  multiUser: React.PropTypes.string,
  page: React.PropTypes.number,
  prefs: React.PropTypes.shape({
    hide_ads: React.PropTypes.bool.isRequired,
  }),
  sort: React.PropTypes.string,
  subredditName: React.PropTypes.string,
};

export default IndexPage;
