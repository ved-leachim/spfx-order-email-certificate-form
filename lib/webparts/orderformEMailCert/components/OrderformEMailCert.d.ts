import * as React from 'react';
import { IOrderformEMailCertProps } from './IOrderformEMailCertProps';
import { IOrderformEMailCertState } from "./IOrderformEMailCertState";
export default class OrderformEMailCert extends React.Component<IOrderformEMailCertProps, IOrderformEMailCertState> {
    private eMailRegex;
    private phoneRegex;
    private csrRegex;
    constructor(probs: IOrderformEMailCertProps, state: IOrderformEMailCertState);
    componentDidUpdate(prevProps: Readonly<IOrderformEMailCertProps>, prevState: Readonly<IOrderformEMailCertState>): void;
    render(): React.ReactElement<IOrderformEMailCertProps>;
    private _onCSRCheck;
    private _handleAddMail;
    private _handleRemoveMail;
    private _handleMailUpdate;
    private _handleFormEnabling;
    private _validatePhoneNumber;
    private _validateCSR;
    private _validateEMail;
    private _handleSend;
    private _resetForm;
}
//# sourceMappingURL=OrderformEMailCert.d.ts.map