Package.describe({
  name: 'partup:client-widget-hovercard',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
    api.use([
        'tap:i18n'
    ], ['client', 'server']);

    api.use([
        'templating'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',
        
        'WidgetProfileHoverCard.html',
        'WidgetProfileHoverCard.js',

        'i18n/en.i18n.json',
        'i18n/nl.i18n.json'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',
        'i18n/en.i18n.json',
        'i18n/nl.i18n.json'
    ], 'server');
});