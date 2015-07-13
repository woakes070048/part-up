/*************************************************************/
/* Partial rendered */
/*************************************************************/
Template.app_partup_navigation.onRendered(function() {
    // Offset to improve window resizing behaviour
    var OFFSET = 100;

    // Find page element
    var pageElm = $('.pu-layout > .pu-sub-pagecontainer');
    if (!pageElm) return;

    // Find left side element
    var leftElm = $('> .pu-sub-partupdetail-left', pageElm);
    if (!leftElm) return;

    // Calculate navigation background width
    var calculateBackgroundWidth = function calculateBackgroundWidth () {
        var backgroundWidth = (window.innerWidth - pageElm.width()) / 2 + leftElm.width() + OFFSET;
        Session.set('partials.partup-detail-navigation.background-width', backgroundWidth);
    };

    // Trigger calculations
    window.addEventListener('resize', calculateBackgroundWidth);
    calculateBackgroundWidth();
});

/*************************************************************/
/* Partial helpers */
/*************************************************************/
Template.app_partup_navigation.helpers({

    backgroundWidth: function() {
        return Session.get('partials.partup-detail-navigation.background-width') || 0;
    },

    isEditableByUser: function() {
        var partup = Partups.findOne({_id: Router.current().params._id});
        if (!partup) return false;

        var user = Meteor.user();
        if (!user) return false;

        return partup.isEditableBy(user);
    }

});

Template.app_partup_navigation.events({
    'click [data-openpartupsettings]': function(event, template) {
        event.preventDefault();

        Intent.go({
            route: 'partup-settings',
            params: {
                _id: template.data.partupId
            }
        });
    }
});
