var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as React from 'react';
import styles from './OrderformEMailCert.module.scss';
import { Checkbox, IconButton, MessageBar, MessageBarType, PrimaryButton, TextField } from "office-ui-fabric-react";
import { addToSPList } from "../services/SPService";
var plusIcon = { iconName: 'Add' };
var minusIcon = { iconName: 'Remove' };
var sendForm = { iconName: 'Send' };
var OrderformEMailCert = /** @class */ (function (_super) {
    __extends(OrderformEMailCert, _super);
    function OrderformEMailCert(probs, state) {
        var _this = _super.call(this, probs) || this;
        _this.eMailRegex = new RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
        _this.phoneRegex = new RegExp(/^([0|+[0-9]{1,3})?([7-9][0-9]{8})$/);
        _this.csrRegex = new RegExp(/^(?:(?!-{3,}(?:BEGIN|END) CERTIFICATE REQUEST)[\s\S])*(-{3,}BEGIN CERTIFICATE REQUEST(?:(?!-{3,}END CERTIFICATE REQUEST)[\s\S])*?-{3,}END CERTIFICATE REQUEST-{3,})(?![\s\S]*?-{3,}BEGIN CERTIFICATE REQUEST[\s\S]+?-{3,}END CERTIFICATE REQUEST[\s\S]*?$)/);
        _this.state = {
            phoneNumber: "",
            csr: "",
            isCSRProvided: false,
            primaryEMailAddress: _this.props.context.pageContext.user.email,
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
        };
        return _this;
    }
    OrderformEMailCert.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (prevState.requiredFields !== this.state.requiredFields)
            this.setState({ isFormValid: this._handleFormEnabling() });
    };
    OrderformEMailCert.prototype.render = function () {
        var _this = this;
        return (React.createElement("section", null,
            React.createElement("div", { className: "".concat(styles.container) },
                React.createElement(TextField, { label: 'Mobile Telefon Nummer', placeholder: "+41791234567", value: this.state.phoneNumber, onChange: function (event) {
                        return _this.setState({ phoneNumber: event.target.value.trim() });
                    }, className: styles.form, required: !this.state.isCSRProvided, description: "Bitte geben Sie die Nummer ohne Leerschl\u00E4ge ein.", disabled: this.state.isCSRProvided, validateOnLoad: false, validateOnFocusOut: true, onGetErrorMessage: function () { return _this._validatePhoneNumber(); } }),
                React.createElement(Checkbox, { label: "CSR verwenden", checked: this.state.isCSRProvided, onChange: function () { return _this._onCSRCheck(); }, className: "".concat(styles.sideControls) }),
                React.createElement(TextField, { label: "Certificate Signing Request (CSR) String", multiline: true, value: this.state.csr, onChange: function (event) { return _this.setState({ csr: event.target.value }); }, className: styles.form, disabled: !this.state.isCSRProvided, required: this.state.isCSRProvided, validateOnLoad: false, validateOnFocusOut: true, onGetErrorMessage: function () { return _this._validateCSR(); } }),
                React.createElement(TextField, { label: 'Prim\u00E4re E-Mail Adresse', className: styles.form, defaultValue: this.props.context.pageContext.user.email, disabled: true }),
                React.createElement("div", { id: "additionalControls", className: "".concat(styles.sideControls) },
                    React.createElement(IconButton, { iconProps: plusIcon, title: "Plus Icon", ariaLabel: "Plus Icon", className: "".concat(styles.additional), onClick: function () { return _this._handleAddMail(); } }),
                    React.createElement(IconButton, { iconProps: minusIcon, title: "Minus Icon", ariaLabel: "Minus Icon", className: "".concat(styles.additional), onClick: function () { return _this._handleRemoveMail(); } }))),
            this.state.eMailAddresses.map(function (mailField, index) { return (React.createElement("div", { key: index, className: styles.additionalFields },
                React.createElement(TextField, { id: "EMailField".concat(index), value: _this.state.eMailAddresses[index].value, label: "Alternative E-Mail Adresse " + mailField.displayNr, onChange: function (event) { return _this._handleMailUpdate(event); }, className: styles.form, validateOnLoad: false, validateOnFocusOut: true, onGetErrorMessage: function () { return _this._validateEMail(index); } }))); }),
            React.createElement("div", { className: styles.additionalFields },
                this.state.showMessage === true ?
                    React.createElement(MessageBar, { messageBarType: this.state.messageType }, this.state.message)
                    :
                        React.createElement(React.Fragment, null),
                React.createElement(PrimaryButton, { iconProps: sendForm, onClick: function () { return _this._handleSend(); }, className: styles.submitButton, disabled: !this.state.isFormValid }, "E-Mail Zertifikat bestellen"))));
    };
    OrderformEMailCert.prototype._onCSRCheck = function () {
        if (this.state.isCSRProvided === true)
            this.setState({
                isCSRProvided: !this.state.isCSRProvided,
                csr: "",
                requiredFields: { hasCSR: false, hasPhoneNumber: this.state.requiredFields.hasPhoneNumber, hasValidEMails: this.state.requiredFields.hasValidEMails }
            });
        else
            this.setState({
                isCSRProvided: !this.state.isCSRProvided,
                phoneNumber: "",
                requiredFields: { hasPhoneNumber: false, hasCSR: this.state.requiredFields.hasCSR, hasValidEMails: this.state.requiredFields.hasValidEMails }
            });
    };
    OrderformEMailCert.prototype._handleAddMail = function () {
        var _this = this;
        if (this.state.eMailCounter < 10) {
            this.setState(function (prevState) { return ({
                eMailAddresses: __spreadArray(__spreadArray([], prevState.eMailAddresses, true), [{ id: "EMailField".concat(_this.state.eMailAddresses.length), value: "", displayNr: _this.state.eMailCounter.toString() }], false),
                eMailCounter: prevState.eMailCounter + 1,
                requiredFields: { hasValidEMails: false, hasPhoneNumber: _this.state.requiredFields.hasPhoneNumber, hasCSR: _this.state.requiredFields.hasCSR }
            }); });
        }
    };
    OrderformEMailCert.prototype._handleRemoveMail = function () {
        if (this.state.eMailCounter > 2) {
            // Last additional E-Mail field gets removed, resets eMailValidation to default true
            if (this.state.eMailCounter === 3)
                this.setState({ requiredFields: { hasValidEMails: true,
                        hasCSR: this.state.requiredFields.hasCSR,
                        hasPhoneNumber: this.state.requiredFields.hasPhoneNumber }
                });
            this.state.eMailAddresses.pop();
            this.setState({ eMailAddresses: this.state.eMailAddresses,
                eMailCounter: this.state.eMailCounter - 1,
                phoneNumber: this.state.phoneNumber });
        }
    };
    OrderformEMailCert.prototype._handleMailUpdate = function (event) {
        var updatedEMailAddresses = this.state.eMailAddresses.map(function (eMailObject) {
            if (event.target.id === eMailObject.id) {
                return __assign(__assign({}, eMailObject), { id: eMailObject.id, value: event.target.value });
            }
            return eMailObject;
        });
        this.setState({ eMailAddresses: updatedEMailAddresses });
    };
    OrderformEMailCert.prototype._handleFormEnabling = function () {
        if (this.state.requiredFields.hasPhoneNumber && this.state.requiredFields.hasValidEMails)
            return true;
        if (this.state.isCSRProvided === true) {
            if (this.state.requiredFields.hasCSR && this.state.requiredFields.hasValidEMails ||
                this.state.requiredFields.hasPhoneNumber && this.state.requiredFields.hasValidEMails)
                return true;
        }
        return false;
    };
    OrderformEMailCert.prototype._validatePhoneNumber = function () {
        if (this.phoneRegex.test(this.state.phoneNumber))
            this.setState({ requiredFields: { hasPhoneNumber: true, hasCSR: this.state.requiredFields.hasCSR, hasValidEMails: this.state.requiredFields.hasValidEMails } });
        else {
            this.setState({ requiredFields: { hasPhoneNumber: false, hasCSR: this.state.requiredFields.hasCSR, hasValidEMails: this.state.requiredFields.hasValidEMails } });
            return "Ungültige Telefonnummer.";
        }
    };
    OrderformEMailCert.prototype._validateCSR = function () {
        if (this.csrRegex.test(this.state.csr))
            this.setState({ requiredFields: { hasCSR: true, hasPhoneNumber: this.state.requiredFields.hasPhoneNumber, hasValidEMails: this.state.requiredFields.hasValidEMails } });
        else {
            this.setState({ requiredFields: { hasCSR: false, hasPhoneNumber: this.state.requiredFields.hasPhoneNumber, hasValidEMails: this.state.requiredFields.hasValidEMails } });
            return "Ungültiger CSR String";
        }
    };
    OrderformEMailCert.prototype._validateEMail = function (index) {
        if (this.eMailRegex.test(this.state.eMailAddresses[index].value))
            this.setState({ requiredFields: { hasValidEMails: true, hasCSR: this.state.requiredFields.hasCSR, hasPhoneNumber: this.state.requiredFields.hasPhoneNumber } });
        else {
            this.setState({ requiredFields: { hasValidEMails: false, hasCSR: this.state.requiredFields.hasCSR, hasPhoneNumber: this.state.requiredFields.hasPhoneNumber } });
            return "Ungültige E-Mail Adresse.";
        }
    };
    OrderformEMailCert.prototype._handleSend = function () {
        var _this = this;
        var alternativeEMailAddresses = "";
        this.state.eMailAddresses.forEach(function (email) {
            alternativeEMailAddresses += email.value + "; ";
        });
        var preparedFormData = {
            phoneNumber: this.state.phoneNumber,
            csr: this.state.csr,
            primaryEMailAddress: this.state.primaryEMailAddress,
            alternativeEMailAddresses: alternativeEMailAddresses.trim()
        };
        addToSPList(this.props.context, preparedFormData)
            .then(function (responseMessage) {
            _this.setState({ showMessage: true, message: responseMessage, messageType: MessageBarType.success });
            _this._resetForm();
        }, function (error) { _this.setState({ showMessage: true, message: error, messageType: MessageBarType.error }); });
    };
    OrderformEMailCert.prototype._resetForm = function () {
        this.setState({
            phoneNumber: "",
            isCSRProvided: false,
            csr: "",
            eMailAddresses: [],
            isFormValid: false,
            eMailCounter: 2
        });
    };
    return OrderformEMailCert;
}(React.Component));
export default OrderformEMailCert;
//# sourceMappingURL=OrderformEMailCert.js.map