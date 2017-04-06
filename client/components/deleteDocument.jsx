import React, { Component } from 'react';
import { Row, Input } from 'react-materialize';

export default class DeleteDocumentModal extends Component {
  render() {
    return (
        <div id="modal3" className="modal">
            <div className="modal-content">
            <h4>Delete Document</h4>
            <p>Are you sure you want to delete document?</p>
            </div>
            <div className="modal-footer">
            <a onClick={() => { this.props.deleteDocument(); }} className="modal-action modal-close waves-effect waves-green btn-flat">Confirm</a>
            <a className="modal-action modal-close waves-effect waves-green btn-flat">Cancel</a>
            </div>
        </div>
    );
  }
}
