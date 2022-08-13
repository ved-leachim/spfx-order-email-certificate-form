import {IFormData} from "./IFormData";
import {SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse} from "@microsoft/sp-http";
import {WebPartContext} from "@microsoft/sp-webpart-base";

export const addToSPList = (context: WebPartContext, formData: IFormData): Promise<string> => {
    const listAPI = context.pageContext.web.absoluteUrl + "/_api/web/lists/getbytitle('EMail Zertifikate')/items"
    const body: string = JSON.stringify(formData);
    const options: ISPHttpClientOptions = {
        headers: {
            Accepts: 'application/json;odata=nometadata',
            'content-type': 'application/json;odata=nometadata',
            'OData-Version': '3.0'
        },
        body: body
    };

    return new Promise<string> ((resolve, reject) => {
        context.spHttpClient.post(listAPI, SPHttpClient.configurations.v1, options)
            .then((response: SPHttpClientResponse) => {
                if (response.ok)
                    resolve("Bestellung erfolgreich erfasst. Sie erhalten in wenigen Minuten eine Bestätigungsmail.");
                else
                    reject("Beim Absenden des Formulars ist ein Fehler aufgetretten. | " + response.status);
            })
            .catch((error) => {
                reject("Beim Absenden des Formulars ist ein Fehler aufgetretten. | " + error.message);
            });
    });
}
