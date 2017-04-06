import React, { Component } from 'react';
import { Row, Input } from 'react-materialize';

export default class SaveDocumentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
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
    return (
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
          <a onClick={this.props.createDoc} className="modal-action modal-close waves-effect waves-green btn-flat ">SAVE</a>
          <a href="" className="modal-action modal-close waves-effect waves-green btn-flat ">SAVE DRAFT</a>
          <a onClick={this.props.clearDoc} className="modal-action modal-close waves-effect waves-green btn-flat ">CANCEL</a>
        </div>
      </div>
    );
  }
}
