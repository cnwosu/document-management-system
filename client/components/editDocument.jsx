import React, { Component } from 'react';
import { Row, Input } from 'react-materialize';

export default class EditDocumentPage extends Component {
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
      <div id="modal2" className="modal modal-fixed-footer">
        <div className="modal-content">
          <h4>Edit Document</h4>
          <Row>
            <Input id="edit_document_title" placeholder="Enter document title. . ." style={titleStyle} s={6} validate />
            <Input id="edit_document_access" s={6} type="select" defaultValue="default">
              <option value="defualt">Select Document Access</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="role">Role</option>
            </Input>
          </Row>
          <textarea id="edit_document_content" placeholder="type document content here . . ." style={textareaStyle} />
        </div>
        <div className="modal-footer">
          <a onClick={() => { this.props.editDocument('save'); }} className="modal-action modal-close waves-effect waves-green btn-flat ">SAVE</a>
          <a href="" className="modal-action modal-close waves-effect waves-green btn-flat ">SAVE DRAFT</a>
          <a onClick={this.props.clearDoc} className="modal-action modal-close waves-effect waves-green btn-flat ">CANCEL</a>
        </div>
      </div>
    );
  }
}
