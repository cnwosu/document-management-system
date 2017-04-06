import React, { Component } from 'react';
import { Collapsible, CollapsibleItem, Row, Input, Pagination, Button, Icon } from 'react-materialize';

export default class DocumentDashboard extends Component {
  render() {
    const searchStyle = {
      letterSpacing: 2,
      fontSize: '16px'
    };
    const allDocumentStyle = {
      cursor: 'pointer'
    };
    const titleResult = (this.props.allTitles.length > 0)
      ? this.props.allTitles.map(title => (
        <option key={this.props.allTitles.indexOf(title) + Math.random()} value={title} />
        )) : null;
    return (
      <div className="col s12">
          <div className="col s2">
            <div className="add-document">
              <a className="text-center" id="add-document" href="#modal1">
                <i className="medium material-icons">library_add</i>
                <br />
                Add document
            </a>
            </div>
          </div>
          <div className="col s2">
            <div className="add-document">
              <a className="text-center" id="my-document" href="" onClick={this.props.getUserDocuments}>
                <i className="medium material-icons">list</i>
                <br />
                My document
            </a>
            </div>
          </div>
          <div className="col s2">
            <div className="add-document">
              <a className="text-center" id="all-documents" style={allDocumentStyle} onClick={this.props.getDocuments}>
                <i className="medium material-icons">library_books</i>
                <br />
                All documents
            </a>
            </div>
          </div>

          <div className="col s6 offset-s4 right">

            <div className="right search-filter">
              <div className="col s12" data-reactid="17">
                <input list="documents" id="searchInput" onChange={this.props.loadTitles} placeholder="search" style={searchStyle} data-reactid="18" />
                <datalist id="documents">
                  { titleResult }
                </datalist>
              </div>
              <Button onClick={() => { this.props.searchDocument(); }} waves="light">search<Icon left>search</Icon></Button>
            </div>
          </div>
        </div>
    );
  }
}
