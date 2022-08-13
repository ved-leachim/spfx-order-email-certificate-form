import * as React from 'react';
import styles from './OrderformEMailCert.module.scss';
import {IOrderformEMailCertProps} from './IOrderformEMailCertProps';
import {IEMailAddress, IOrderformEMailCertState} from "./IOrderformEMailCertState";
import {
    Checkbox,
    IconButton,
    IIconProps, MessageBar,
    MessageBarType,
    PrimaryButton,
    TextField
} from "office-ui-fabric-react";
import {IFormData} from "../services/IFormData";
import {addToSPList} from "../services/SPService";

const plusIcon: IIconProps = {iconName: 'Add'};
const minusIcon: IIconProps = {iconName: 'Remove'};
const sendForm: IIconProps ={iconName: 'Send'};

export default class OrderformEMailCert extends React.Component<IOrderformEMailCertProps, IOrderformEMailCertState> {

    private eMailRegex = new RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
    private phoneRegex = new RegExp(/^([0|+[0-9]{1,3})?([7-9][0-9]{8})$/);
    private csrRegex = new RegExp(/^(?:(?!-{3,}(?:BEGIN|END) CERTIFICATE REQUEST)[\s\S])*(-{3,}BEGIN CERTIFICATE REQUEST(?:(?!-{3,}END CERTIFICATE REQUEST)[\s\S])*?-{3,}END CERTIFICATE REQUEST-{3,})(?![\s\S]*?-{3,}BEGIN CERTIFICATE REQUEST[\s\S]+?-{3,}END CERTIFICATE REQUEST[\s\S]*?$)/)

    constructor(probs: IOrderformEMailCertProps, state: IOrderformEMailCertState) {
        super(probs);
        this.state = {
            phoneNumber: "",
            csr: "",
            isCSRProvided: false,
            primaryEMailAddress: this.props.context.pageContext.user.email,
            eMailAddresses: [],
            eMailCounter: 2,
            showMessage: false,
            message: "",
            messageType: MessageBarType.success,
            requiredFields: {
                hasPhoneNumber: false,
                hasCSR: false,
                hasValidEMails: true
            },
            isFormValid: false
        }
    }

    componentDidUpdate(prevProps: Readonly<IOrderformEMailCertProps>, prevState: Readonly<IOrderformEMailCertState>): void {
        if (prevState.requiredFields !== this.state.requiredFields)
            this.setState({isFormValid: this._handleFormEnabling()})
    }

    public render(): React.ReactElement<IOrderformEMailCertProps> {

        return (
            <section>
                <div className={`${styles.container}`}>
                    <TextField
                        label='Mobile Telefon Nummer'
                        placeholder="+41791234567"
                        value={this.state.phoneNumber}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            this.setState({phoneNumber: event.target.value.trim() })}
                        className={styles.form}
                        required={!this.state.isCSRProvided}
                        description="Bitte geben Sie die Nummer ohne Leerschläge ein."
                        disabled={this.state.isCSRProvided}
                        validateOnLoad={false}
                        validateOnFocusOut={true}
                        onGetErrorMessage={() => this._validatePhoneNumber()} />
                    <Checkbox
                        label="CSR verwenden"
                        checked={this.state.isCSRProvided}
                        onChange={() => this._onCSRCheck()}
                        className={`${styles.sideControls}`} />
                    <TextField
                        label="Certificate Signing Request (CSR) String"
                        multiline
                        value={this.state.csr}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setState({csr: event.target.value})}
                        className={styles.form}
                        disabled={!this.state.isCSRProvided}
                        required={this.state.isCSRProvided}
                        validateOnLoad={false}
                        validateOnFocusOut={true}
                        onGetErrorMessage={() => this._validateCSR()} />
                    <TextField
                        label='Primäre E-Mail Adresse'
                        className={styles.form}
                        defaultValue={this.props.context.pageContext.user.email}
                        disabled />
                    <div id="additionalControls" className={`${styles.sideControls}`}>
                        <IconButton
                            iconProps={plusIcon}
                            title="Plus Icon"
                            ariaLabel="Plus Icon"
                            className={`${styles.additional}`}
                            onClick={() => this._handleAddMail()} />
                        <IconButton
                            iconProps={minusIcon}
                            title="Minus Icon"
                            ariaLabel="Minus Icon"
                            className={`${styles.additional}`}
                            onClick={() => this._handleRemoveMail()} />
                    </div>
                </div>
                {
                    this.state.eMailAddresses.map((mailField, index) => (
                        <div key={index} className={styles.additionalFields}>
                            <TextField
                                id={`EMailField${index}`}
                                value={this.state.eMailAddresses[index].value}
                                label={"Alternative E-Mail Adresse " + mailField.displayNr}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => this._handleMailUpdate(event)}
                                className={styles.form}
                                validateOnLoad={false}
                                validateOnFocusOut={true}
                                onGetErrorMessage={() => this._validateEMail(index)}
                            />
                        </div>
                    ))
                }
                <div className={styles.additionalFields}>
                    {
                        this.state.showMessage === true ?
                            <MessageBar
                            messageBarType={this.state.messageType}>
                                {this.state.message}
                            </MessageBar>
                            :
                            <></>
                    }

                    <PrimaryButton
                        iconProps={sendForm}
                        onClick={() => this._handleSend()}
                        className={styles.submitButton}
                        disabled={!this.state.isFormValid}>
                        E-Mail Zertifikat bestellen
                    </PrimaryButton>
                </div>
            </section>
        );
    }

    private _onCSRCheck(): void {
        if (this.state.isCSRProvided === true)
            this.setState({
                isCSRProvided: !this.state.isCSRProvided,
                csr: "",
                requiredFields: {hasCSR: false, hasPhoneNumber: this.state.requiredFields.hasPhoneNumber, hasValidEMails: this.state.requiredFields.hasValidEMails}
            });
        else
            this.setState({
                isCSRProvided: !this.state.isCSRProvided,
                phoneNumber: "",
                requiredFields: {hasPhoneNumber: false, hasCSR: this.state.requiredFields.hasCSR, hasValidEMails: this.state.requiredFields.hasValidEMails}
            });
    }

    private _handleAddMail(): void {
        if (this.state.eMailCounter < 10) {
            this.setState(prevState => ({
                eMailAddresses: [...prevState.eMailAddresses, {id: `EMailField${this.state.eMailAddresses.length}`, value: "", displayNr: this.state.eMailCounter.toString()}],
                eMailCounter: prevState.eMailCounter + 1,
                requiredFields: {hasValidEMails: false, hasPhoneNumber: this.state.requiredFields.hasPhoneNumber, hasCSR: this.state.requiredFields.hasCSR}
            }));
        }
    }

    private _handleRemoveMail(): void {
        if (this.state.eMailCounter > 2) {

            // Last additional E-Mail field gets removed, resets eMailValidation to default true
            if (this.state.eMailCounter === 3)
                this.setState({requiredFields: {hasValidEMails: true,
                        hasCSR: this.state.requiredFields.hasCSR,
                        hasPhoneNumber: this.state.requiredFields.hasPhoneNumber}
                })

            this.state.eMailAddresses.pop();
            this.setState({eMailAddresses: this.state.eMailAddresses,
            eMailCounter: this.state.eMailCounter -1,
            phoneNumber: this.state.phoneNumber})
        }
    }

    private _handleMailUpdate(event: React.ChangeEvent<HTMLInputElement>): void {
        const updatedEMailAddresses: IEMailAddress[] = this.state.eMailAddresses.map((eMailObject) => {
            if (event.target.id === eMailObject.id){
                return {...eMailObject, id: eMailObject.id, value: event.target.value}
            }
            return eMailObject
        })
        this.setState({eMailAddresses: updatedEMailAddresses})
    }

    private _handleFormEnabling(): boolean {
        if (this.state.requiredFields.hasPhoneNumber && this.state.requiredFields.hasValidEMails)
            return true

        if (this.state.isCSRProvided === true) {
            if (this.state.requiredFields.hasCSR && this.state.requiredFields.hasValidEMails ||
                this.state.requiredFields.hasPhoneNumber && this.state.requiredFields.hasValidEMails)
                return true
        }
        return false
    }

    private _validatePhoneNumber(): string {
        if (this.phoneRegex.test(this.state.phoneNumber))
            this.setState({requiredFields: {hasPhoneNumber: true, hasCSR: this.state.requiredFields.hasCSR, hasValidEMails: this.state.requiredFields.hasValidEMails}})
        else {
            this.setState({requiredFields: {hasPhoneNumber: false, hasCSR: this.state.requiredFields.hasCSR, hasValidEMails: this.state.requiredFields.hasValidEMails}})
            return "Ungültige Telefonnummer."
        }
    }

    private _validateCSR(): string {
        if (this.csrRegex.test(this.state.csr))
            this.setState({requiredFields: {hasCSR: true, hasPhoneNumber: this.state.requiredFields.hasPhoneNumber, hasValidEMails: this.state.requiredFields.hasValidEMails}})
        else {
            this.setState({requiredFields: {hasCSR: false, hasPhoneNumber: this.state.requiredFields.hasPhoneNumber, hasValidEMails: this.state.requiredFields.hasValidEMails}})
            return "Ungültiger CSR String"
        }
    }

    private _validateEMail(index: number): string {
        if (this.eMailRegex.test(this.state.eMailAddresses[index].value))
            this.setState({requiredFields: {hasValidEMails: true, hasCSR: this.state.requiredFields.hasCSR, hasPhoneNumber: this.state.requiredFields.hasPhoneNumber}})
        else {
            this.setState({requiredFields: {hasValidEMails: false, hasCSR: this.state.requiredFields.hasCSR, hasPhoneNumber: this.state.requiredFields.hasPhoneNumber}})
            return "Ungültige E-Mail Adresse."
        }
    }

    private _handleSend(): void {
        let alternativeEMailAddresses: string = "";
        this.state.eMailAddresses.forEach(email => {
            alternativeEMailAddresses += email.value + "; "
        })

        const preparedFormData: IFormData = {
            phoneNumber: this.state.phoneNumber,
            csr: this.state.csr,
            primaryEMailAddress: this.state.primaryEMailAddress,
            alternativeEMailAddresses: alternativeEMailAddresses.trim()

        }
        addToSPList(this.props.context, preparedFormData)
            .then((responseMessage) => {this.setState({showMessage: true, message: responseMessage, messageType: MessageBarType.success});
                this._resetForm()},
                (error) => {this.setState({showMessage: true, message: error, messageType: MessageBarType.error})});
    }

    private _resetForm(): void {
        this.setState({
            phoneNumber: "",
            isCSRProvided: false,
            csr: "",
            eMailAddresses: [],
            isFormValid: false,
            eMailCounter: 2
        });
    }
}
