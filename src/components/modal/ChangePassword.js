import React from 'react';

import Input from '../input/Input'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ChangePassword = (props) => (

    <div>
        <Modal isOpen={props.modal} toggle={props.toggle} className="">
            <ModalHeader> Change password </ModalHeader>
            <ModalBody>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <Input id="password" text="Old Password" onChange={props.onChangePassword} type="password" />
                    </div>
                    <div className="form-group col-md-12">
                        <Input id="confirm_password" text="New Password" onChange={props.onChangeConfirmPassword} type="password" />
                    </div>
                    <div className="form-group col-md-12">
                        <Input id="updated_password" text="Confirm Password" onChange={props.onChangePassword} type="password" />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={props.close}>Close</Button>
                <Button color="primary" onClick={props.save}>Save</Button>
            </ModalFooter>
        </Modal>
    </div>

);

export default ChangePassword;