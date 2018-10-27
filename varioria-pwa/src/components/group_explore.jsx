import './theme.css'

import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Navbar from './nav_bar';
import CircularProgress from '@material-ui/core/CircularProgress';
import TimeAgo from 'react-timeago';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import { Tabs, WhiteSpace, List } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';

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
          thumb="https://cdn1.iconfinder.com/data/icons/file-types-23/48/PDF-128.png"
          multipleLine
          onClick={() => {this.props.history.push(`/group-documents/${element.slug}`)}}
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
            swipeable={false}
            renderTabBar={this.renderReactSticky}
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
    if (this.state.loading) {
      return (
        <div>
          <Navbar title="" history={this.props.history} match={this.props.match}/>
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      );
    }
    const coterieName= this.props.coteries[this.props.match.params.groupUuid].name;
    return (
      <div>
        <Navbar title={coterieName} history={this.props.history} match={this.props.match}/>
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
