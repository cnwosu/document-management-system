import React, { Component } from 'react';
import { Collapsible, CollapsibleItem, Row, Input } from 'react-materialize';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDocuments: []
    };
    this.createDoc = this.createDoc.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
  }
    // Load all documents accesible to the user when user logs in.
  componentDidMount() {
    this.getDocuments();
  }
  getDocuments() {
    // Get user token from localstorage
    const token = localStorage.getItem('token');
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization: token
      }
    };
    const url = `${window.location.href}api/documents`;

    if (!token) {
      // set the location to HomePage
      window.location.reload();
    }
    fetch(url, options).then(data => data.json())
      .then((res) => {
        this.setState({
          allDocuments: res
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
    const url = `${window.location.href}api/documents`;
    fetch(url, options).then(data => data.json())
      .then((res) => {
        if (res && res.id) {
          this.getDocuments();
        }
      });
  }
  render() {
    $('select').material_select();
    $('#modal1').modal();

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
    const document = (this.state.allDocuments.length > 0)
      ? this.state.allDocuments.map(doc =>
        (<CollapsibleItem key={doc.id} header={doc.title} icon="library_books">
          { doc.content }
        </CollapsibleItem>))
      : <div />;
    return (
      <div className="row">
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

          <div className="col s6 offset-s4 right">

            <div className="right search-filter">

              <div className="input-field inline">
                <input id="search" type="search" className="search" />
                <label htmlFor="Search" data-error="wrong" data-success="right">Search</label>
              </div>

              <div className="input-field inline">
                <select>
                  <option value="" defaultValue>Search By</option>
                  <option value="1">Title</option>
                  <option value="2">Date Created</option>
                  <option value="3">Access</option>
                  <option value="4">Role ID</option>
                </select>
              </div>

              <div className="input-field inline">
                <input type="button" value="Submit" className="waves-effect teal waves-light btn submit-button" />
              </div>

            </div>
          </div>
        </div>
        <hr />

        {/* Modal Structure  */}
        <div id="modal1" className="modal modal-fixed-footer">
          <div className="modal-content">
            <h4>New Document</h4>
            <Row>
              <Input id="document_title" placeholder="Enter document title. . ." style={titleStyle} s={6} validate />
              <Input id="document_access" s={6} type="select" defaultValue="default">
                <option value="defualt">Select Document Access</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="role">Role</option>
              </Input>
            </Row>
            <textarea id="document_content" placeholder="type document content here . . ." style={textareaStyle} />
          </div>
          <div className="modal-footer">
            <a onClick={this.createDoc} className="modal-action modal-close waves-effect waves-green btn-flat ">SAVE</a>
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat ">SAVE DRAFT</a>
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat ">CANCEL</a>
          </div>
        </div>
        <Collapsible popout>
          { document }
        </Collapsible>


      </div>
    );
  }
}
export default HomePage;
