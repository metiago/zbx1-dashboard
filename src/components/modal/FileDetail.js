import React from 'react';

import moment from 'moment'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const FileDetail = (props) => (

    <div>
        <Modal isOpen={props.modal} toggle={props.toggle} className="">
            <ModalHeader> {props.title} </ModalHeader>
            <ModalBody>
                <p>
                    Name: {props.title}
                </p>
                <p>
                    Owner: {props.username}
                </p>
                <p>
                    Created: {moment(props.created).format('MMMM Do YYYY, h:mm:ss a')}
                </p>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={props.detail}>Close</Button>
                <Button color="danger" onClick={() => props.delete(props.fileID)}>Delete</Button>
            </ModalFooter>
        </Modal>
    </div>

);

export default FileDetail;