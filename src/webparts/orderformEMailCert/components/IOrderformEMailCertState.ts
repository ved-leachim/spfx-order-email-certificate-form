import {MessageBarType} from "office-ui-fabric-react";

export interface IOrderformEMailCertState {
    phoneNumber: string
    csr: string
    isCSRProvided: boolean
    primaryEMailAddress: string
    eMailAddresses: IEMailAddress[]
    eMailCounter: number
    showMessage: boolean
    message: string
    messageType: MessageBarType
    requiredFields: IRequiredFields
    isFormValid: boolean
}

export interface IEMailAddress {
    id: string,
    displayNr: string,
    value: string
}

export interface IRequiredFields {
    hasPhoneNumber: boolean,
    hasCSR: boolean
    hasValidEMails: boolean
}
