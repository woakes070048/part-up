/**
 * Render a widget to view/edit a single network's custom access settings
 *
 * @param {Number} networkSlug
 */
Template.NetworkSettingsAccess.onCreated(function() {
    var template = this;
    var userId = Meteor.userId();

    template.subscribe('networks.one', template.data.networkSlug, {
        onReady: function() {
            var network = Networks.findOne({slug: template.data.networkSlug});
            if (!network) Router.pageNotFound('network');
            if (network.isClosedForUpper(userId)) Router.pageNotFound('network');
        }
    });
});

Template.NetworkSettingsAccess.helpers({
});
