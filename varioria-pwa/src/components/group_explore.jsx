import './theme.css'

import * as actions from '../actions';

import { ActivityIndicator, List, Tabs, WhiteSpace } from 'antd-mobile';
import React, { Component } from 'react';
import { Sticky, StickyContainer } from 'react-sticky';

import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import NoPermission from './error_page/no_permission';
import NotSignedIn from './error_page/not_signed_in';
import TimeAgo from 'react-timeago';
import _ from 'lodash';
import { connect } from 'react-redux';
import pdfIcon from '../utilities/pdf.png';

class GroupExplore extends Component {
  state = { loading: true }

  componentDidMount() {
    this.props.getMyCoteries().then(() => {
      this.setState({ loading: false });
    });
  }

  renderReactSticky(props) {
    return (
      <Sticky>
        {({ style }) =>
          <div style={{  ...style, zIndex: 1 }}>
            <Tabs.DefaultTabBar {...props} />
          </div>
        }
      </Sticky>
    )
  }

  renderCoterieDocuments() {
    const coterieDocs = this.props.coteries[this.props.match.params.groupUuid].coteriedocument_set;
    const data = coterieDocs.map(element => {
      return (
        <List.Item
          key={element.slug}
          extra={<TimeAgo date={element.upload_time} />}
          thumb={<img src={pdfIcon} alt='pdf-icon' style={{height: 28, width: 24}} />}
          multipleLine
          onClick={() => {
            const groupUuid = this.props.match.params.groupUuid
            const coterie = this.props.coteries[groupUuid]
            const coterieId = coterie.pk
            this.props.history.push(`/coteries/${coterieId}/documents/${element.slug}`)
          }}
        >
          {element.title}
          <List.Item.Brief>{element.uploader_name}</List.Item.Brief>
        </List.Item>
      )
    }).reverse()
    return (
      <List>
        {data}
      </List>
    )
  }

  renderCoterieReadlists() {
    // ======= TODO: Implement coterie readlists  ==========
    return (
      <List>
        <List.Item>
          <div style={{color: 'grey', textAlign:'center' }}>
            Group-based readlists still in development.
          </div>
        </List.Item>
      </List>
    )
    // ======================================================
  }

  renderStickyTab() {
    return (
      <div>
        <WhiteSpace />
        <StickyContainer>
          <Tabs
            tabs={[{ title: "Documents"}, { title: "Readlists"}]}
            initalPage={'t2'}
            swipeable={true}
            _renderTabBar={this.renderReactSticky}
          >
            <div style={{ justifyContent: 'center', height: '100%'}}>
              {this.renderCoterieDocuments()}
            </div>
            <div style={{ justifyContent: 'center', height: '100%'}}>
              {this.renderCoterieReadlists()}
            </div>
          </Tabs>
        </StickyContainer>
        <WhiteSpace />
      </div>
    )
  }

  render() {
    if (this.state.loading)
      return <ActivityIndicator toast animating={this.state.loading} />

    if (!this.props.user || !this.props.user.is_authenticated) {
      return (
        <NotSignedIn history={this.props.history}/>
      )
    }

    const currentCoterie = this.props.coteries[this.props.match.params.groupUuid];

    if (!currentCoterie) {
      return (
        <NoPermission />
      )
    }

    return (
      <div>
        {this.renderStickyTab()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    explore: state.explore,
    coteries: state.coteries
  };
}

export default connect(mapStateToProps, actions)(GroupExplore);
