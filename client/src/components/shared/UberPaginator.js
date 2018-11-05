import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import { Pagination } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import qs from 'qs';
import { compose } from 'recompose';


class UberPaginator extends React.Component {

  static propTypes = {
    summaryQuery: PropTypes.shape({
      query: PropTypes.object.isRequired,
      variables: PropTypes.object.isRequired,
      dataKey: PropTypes.string.isRequired
    }).isRequired,

    itemsQuery: PropTypes.shape({
      query: PropTypes.object.isRequired,
      variables: PropTypes.object.isRequired,
      dataKey: PropTypes.string.isRequired
    }).isRequired,

    children: PropTypes.func.isRequired,
    perPage: PropTypes.number
  };

  static defaultProps = {
    perPage: 25
  };

  render() {
    const { summaryQuery, itemsQuery, perPage, location, children } = this.props;

    return (
      <Query
        query={summaryQuery.query}
        variables={summaryQuery.variables}
      >
        {({ data, loading: loadingSummary }) => {
          const { search } = location;

          const totalPages = _.ceil(_.get(data, summaryQuery.dataKey, 0) / perPage);
          const locationPage = qs.parse(search, { ignoreQueryPrefix: true });

          const activePage = _.get(locationPage, 'page', totalPages);
          const page = activePage ? activePage - 1 : activePage;

          return !loadingSummary && (
            <Query
              query={itemsQuery.query}
              variables={{ ...itemsQuery.variables, page, perPage }}
            >
              {({ data: dataItems, loading: loadingItems, subscribeToMore, refetch }) => (
                <React.Fragment>
                  {totalPages > 1 && (
                    <Pagination totalPages={totalPages} activePage={activePage}
                                onPageChange={this._handlePageChange(refetch)} />
                  )}

                  {
                    children({
                      subscribeToMore,
                      loading: loadingSummary || loadingItems,
                      items: _.get(dataItems, itemsQuery.dataKey)
                    })
                  }

                  {totalPages > 1 && (
                    <Pagination totalPages={totalPages} activePage={activePage}
                                onPageChange={this._handlePageChange(refetch)} />
                  )}
                </React.Fragment>
              )}
            </Query>
          );
        }}
      </Query>
    );
  }

  _handlePageChange = (refetch) => (e, { activePage }) => {
    const { history, match: { url } } = this.props;
    const page = qs.stringify({ page: activePage });

    history.push(`${url}?${page}`);

    return refetch({ page: activePage - 1 });
  };

}

export default compose(
  withRouter,
)(UberPaginator);
