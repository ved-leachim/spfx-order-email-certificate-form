export var prepareFormData = function (data) {
    return {
        identifier: data.identifier,
        primaryEMailAddress: data.primaryEMailAddress,
        alternativeEMailAddresses: data.eMailAddresses.join(", ")
    };
};
//# sourceMappingURL=utilities.js.map