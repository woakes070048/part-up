Partup.client.datepicker = {

    /**
     * Bootstrap datepicker options
     *
     * @memberOf Partup.client
     */
    options: {
        language: moment.locale(),
        format: moment.localeData().longDateFormat('L').toLowerCase(),
        startDate: new Date()
    }

};
