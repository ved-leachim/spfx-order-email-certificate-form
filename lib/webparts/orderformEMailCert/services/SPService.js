import { SPHttpClient } from "@microsoft/sp-http";
export var addToSPList = function (context, formData) {
    var listAPI = context.pageContext.web.absoluteUrl + "/_api/web/lists/getbytitle('EMail Zertifikate')/items";
    var body = JSON.stringify(formData);
    var options = {
        headers: {
            Accepts: 'application/json;odata=nometadata',
            'content-type': 'application/json;odata=nometadata',
            'OData-Version': '3.0'
        },
        body: body
    };
    return new Promise(function (resolve, reject) {
        context.spHttpClient.post(listAPI, SPHttpClient.configurations.v1, options)
            .then(function (response) {
            if (response.ok)
                resolve("Bestellung erfolgreich erfasst. Sie erhalten in wenigen Minuten eine Bestätigungsmail.");
            else
                reject("Beim Absenden des Formulars ist ein Fehler aufgetretten. | " + response.status);
        })
            .catch(function (error) {
            reject("Beim Absenden des Formulars ist ein Fehler aufgetretten. | " + error.message);
        });
    });
};
//# sourceMappingURL=SPService.js.map