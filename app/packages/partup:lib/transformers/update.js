/**
 @namespace Update transformer service
 @name partup.transformers.update
 @memberOf partup.transformers
 */
Partup.transformers.update = {

    /**
     * Transform form to new message
     *
     * @memberOf partup.transformers.update
     * @param {mixed[]} fields
     * @param {object} upper
     * @param {string} partupId
     */
    'fromFormNewMessage': function(fields, upper, partupId) {

        return {
            created_at: new Date(),
            partup_id: partupId,
            type: 'partups_image_changed',
            type_data: {
                new_value: fields.content
            },
            upper_id: upper._id
        };

    }

};
