import React, { Component } from 'react';
import moment from 'moment';
import { Router, Route, browserHistory, hashHistory, Link } from 'react-router';
import { Collapsible, CollapsibleItem, Row, Input, Pagination, Button, Icon } from 'react-materialize';
import SaveDocumentPage from './saveDocument.jsx';
import EditDocumentPage from './editDocument.jsx';
import DeleteDocumentModal from './deleteDocument.jsx';
import DocumentDashboard from './documentDashboard.jsx';
import config from '../config/config.js';
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDocuments: [],
      allTitles: [],
      limit: 5,
      documentsNumber: 0,
      user: {}
    };
    this.documentTitles = [];
    this.foundTitles = [];
    this.createDoc = this.createDoc.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
    this.paginateDocuments = this.paginateDocuments.bind(this);
    this.clearDoc = this.clearDoc.bind(this);
    this.paginate = this.paginate.bind(this);
    this.loadTitles = this.loadTitles.bind(this);
    this.searchDocument = this.searchDocument.bind(this);
    this.editDocument = this.editDocument.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.getUserDocuments = this.getUserDocuments.bind(this);
    this.token = localStorage.getItem('token');
    this.documentId = 0;
  }
    // Load all documents accesible to the user when user logs in.
  componentDidMount() {
    this.getDocuments();
  }

  getDocuments(query) {
    // Get user token from localstorage
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    this.setState({
      user: userData
    });
    const token = this.token;
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization: token
      }
    };
    const url1 = `/api/documents?limit=${this.state.limit}&offset=0`;
    const url2 = '/api/documents';

    if (!token) {
      // set the location to HomePage
      browserHistory.push('login');
    }

    fetch(url1, options).then(data => data.json())
      .then((res) => {
        this.setState({
          allDocuments: res
        });
      });
      // Fetch all documents for the search
    fetch(url2, options).then(data => data.json())
      .then((data) => {
        data.map((document) => {
          this.documentTitles.push(document.title);
        });
        let numOfPages = data.length / 5;
        numOfPages = Math.ceil(numOfPages);
        this.setState({
          documentsNumber: numOfPages
        });
      });
  }

  getUserDocuments(e) {
    e.preventDefault();
    const token = this.token;
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization: token
      }
    };
    const url = `/api/users/${userData.userId}/documents`;

    fetch(url, options).then(data => data.json())
      .then((res) => {
        this.setState({
          allDocuments: res.documents
        });
      });
  }

  searchDocument() {
    const token = this.token;
    let searchTitle = '';
    searchTitle = document.getElementById('searchInput').value;
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization: token
      }
    };
    const url = `/api/search/documents?title=${searchTitle}`;
    fetch(url, options).then(data => data.json())
      .then((res) => {
        this.setState({
          allDocuments: res
        });
      });
  }

  paginateDocuments(limit = this.state.limit, offset = 0) {
    // Get user token from localstorage
    const token = this.token;
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization: token
      }
    };
    const url = `/api/documents?limit=${limit}&offset=${offset}`;

    if (!token) {
      // set the location to HomePage
      window.location.reload();
    }

    fetch(url, options).then(data => data.json())
      .then((res) => {
        this.setState({
          paginated: res
        });
      });
  }

  createDoc(e) {
    e.preventDefault();
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const title = document.getElementById('document_title').value;
    const content = document.getElementById('document_content').value;
    const access = document.getElementById('document_access').value;
    const userId = userData.userId;

    // Validate that title/content is not empty like if(title.trim() !== "")
    const token = localStorage.getItem('token');
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization: token
      },
      body: `title=${title}&content=${content}&access=${access}&userId=${userId}`
    };
    const url = `/api/documents`;
    fetch(url, options).then(data => data.json())
      .then((res) => {
        if (res && res.id) {
          this.clearDoc();
          this.getDocuments();
        }
      });
  }
  clearDoc() {
    // Clear document entries
    document.getElementById('document_title').value = '';
    document.getElementById('document_content').value = '';
    $('#document_access').val('defualt');
  }

  paginate(pageNumber) {
    const offset = (pageNumber - 1) * this.state.limit;
    this.paginateDocuments(this.state.limit, offset);
  }

  displayDocuments(documents) {
    return documents.map(doc =>
        (<CollapsibleItem key={doc.id} header={`${doc.title} - ${moment(doc.createdAt).format('LL')}`} icon="library_books">
          { doc.content }
          {((doc.userId === this.state.user.userId) || (this.state.user.userId === 1))
            ? <ul className="pagination">
              <li><a href="#modal2" onClick={() => { this.editDocument('display', doc.id); }}> <i className="small material-icons">mode_edit</i> </a></li>
              <li><a href="#modal3" onClick={() => { this.documentId = doc.id; }}> <i className="small material-icons">delete</i> </a></li>
            </ul>
            : null
          }
        </CollapsibleItem>));
  }

  editDocument(type, docId = this.documentId) {
    // Make call to the api and fetch document details
    this.documentId = docId;
    const token = this.token;
    const url = `/api/documents/${docId}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization: token
      }
    };
    if (type === 'display') {
      fetch(url, options).then(data => data.json())
        .then((res) => {
          document.getElementById('edit_document_title').value = res.document.title;
          document.getElementById('edit_document_content').value = res.document.content;
        });
    } else if (type === 'save') {
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      const title = document.getElementById('edit_document_title').value;
      const content = document.getElementById('edit_document_content').value;
      const access = document.getElementById('edit_document_access').value;
      const userId = userData.userId;

      // update the options to be a put method
      const body = `title=${title}&content=${content}&access=${access}&userId=${userId}`;
      options.method = 'PUT';
      options.url = `/api/documents/${this.documentId}`;
      options.body = body;
      fetch(url, options).then(data => data.json())
      .then(() => {
        // Update documents lists
        this.getDocuments();
      });
    }
  }

  deleteDocument() {
    const token = this.token;
    const url = `/api/documents/${this.documentId}`;
    const options = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization: token
      }
    };
    fetch(url, options).then(data => data.json())
      .then(() => {
        // Update documents lists after delete
        this.getDocuments();
      });
  }
  loadTitles(e) {
    this.foundTitles = [];
    this.documentTitles.forEach((title) => {
      const test = e.target.value,
        titleName = test.replace(/[^\w\s]/gi, ''),
        regex = new RegExp(titleName, 'gi');
      const result = title.match(regex);
      if (result) {
        const index = this.documentTitles.indexOf(title);
        const foundTitle = this.documentTitles[index];
        this.foundTitles.push(foundTitle);
      }
    });
    this.setState({
      allTitles: this.foundTitles
    });
  }

  render() {
    $('select').material_select();
    $('#modal1').modal();
    $('#modal2').modal();
    $('#modal3').modal();
    $('.user_profile_tab').sideNav({ edge: 'right' });
    $('.all_user_profile_tab').sideNav({ edge: 'right' });

    const textareaStyle = {
      position: 'relative',
      width: '100%',
      height: '200px',
      letterSpacing: 3
    };
    const titleStyle = {
      letterSpacing: 3,
      fontWeight: 'bold',
      fontSize: '20px'
    };
    const searchStyle = {
      letterSpacing: 2,
      fontSize: '16px'
    };

    const document = this.displayDocuments(this.state.paginated || this.state.allDocuments);
    return (
      <div className="row">

        <DocumentDashboard searchDocument={this.searchDocument} loadTitles={this.loadTitles} getDocuments={this.getDocuments} allTitles={this.state.allTitles} getUserDocuments={this.getUserDocuments} />
        <hr />

        {/* New Document Modal  */}
        <SaveDocumentPage createDoc={this.createDoc} clearDoc={this.clearDoc} />

        {/* Edit Document Modal */}
        <EditDocumentPage clearDoc={this.clearDoc} editDocument={this.editDocument} />

        <DeleteDocumentModal deleteDocument={this.deleteDocument} />

        <div className="collapsible-popout" >
          <Collapsible popout>
            { document }
          </Collapsible>
        </div>

        <Pagination items={this.state.documentsNumber} onSelect={this.paginate} maxButtons={this.state.documentsNumber} />
      </div>
    );
  }
}
export default HomePage;
