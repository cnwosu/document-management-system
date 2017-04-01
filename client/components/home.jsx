import React, { Component } from 'react';
import { Collapsible, CollapsibleItem } from 'react-materialize';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDocuments: []
    };
    this.showDoc = this.showDoc.bind(this);
  }
    // Load all documents accesible to the user when user logs in.
  componentDidMount() {
    // Get user token from localstorage
    // $('.carousel.carousel-slider').carousel({ fullWidth: true });
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
  showDoc() {
    return (this.state.allDocuments.length > 0) ?
      this.state.allDocuments.map(doc => (
        <div key={doc.id} id={`doc${doc.id}`}>
          <h2>{doc.title}</h2>
          <p className="white-text">{doc.content}</p>
        </div>
        ))
     : <div />;
  }
  render() {
    $('select').material_select();
    $('#modal1').modal();
    // $('.carousel.carousel-slider').carousel({ fullWidth: true });
    // $('.carousel').carousel();

    const textareaStyle = {
      position: 'relative',
      width: '100%',
      height: '200px',
      letterSpacing: 3
    };
    const document = (this.state.allDocuments.length > 0)
      ? this.state.allDocuments.map(doc =>
        (<CollapsibleItem key={doc.id} header={doc.title} icon="library_books">
          { doc.content }
        </CollapsibleItem>))
      : <div />;
    // document.getElementById('doc1').className = 'carousel-item teal white-text';
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

        {/*  Modal Trigger  */}
        {/* <a className="modal-trigger waves-effect waves-light btn" href="#modal1">Modal</a>*/}

        {/* Modal Structure  */}
        <div id="modal1" className="modal modal-fixed-footer">
          <div className="modal-content">
            <h4>New Document</h4>
            <textarea id="newDocumentContent" placeholder="type document content here . . ." style={textareaStyle} />
          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat ">SAVE</a>
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
