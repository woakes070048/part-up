Migrations.add({
    version: 1,
    name: 'Copy all inserted user and partup tags to Tags collection.',
    up: function() {
        var tags = [];

        // Collect all tags from user profiles
        Meteor.users.find().fetch().forEach(function(user) {
            if (user.tags !== undefined) {
                user.tags.forEach(function(tag) {
                    tags.push(tag.toLocaleLowerCase());
                });
            }
        });

        // Collect all tags from partups
        Partups.find().fetch().forEach(function(partup) {
            if (partup.tags !== undefined) {
                partup.tags.forEach(function(tag) {
                    tags.push(tag.toLocaleLowerCase());
                });
            }
        });

        // Remove duplicates
        var uniqueTags = tags.filter(function(elem, pos) {
            return tags.indexOf(elem) == pos;
        });

        // Now insert all collected tags into the database
        uniqueTags.forEach(function(tag) {
            var trimmedTag = tag.trim(); // Some tags had leading or trailing spaces
            if (!Tags.findOne({_id: trimmedTag})) {
                Tags.insert({_id: trimmedTag});
            }
        });

        Log.debug(uniqueTags.length + ' tags inserted in Tags collection.');
    },
    down: function() {
        // Code to migrate to previous version
    }
});

Migrations.add({
    version: 2,
    name: 'Save old images to new image stores',
    up: function() {
        console.log('Save old images to new image stores');
        Images.find().fetch().forEach(function(image) {
            if (image.copies['32x32'].size === 0) {
                console.log('creating 32x32 image: ' + image.name());
                var readStream = image.createReadStream('original');
                var writeStream = image.createWriteStream('32x32');
                gm(readStream, image.name()).resize(32, 32).stream().pipe(writeStream);
            }
            if (image.copies['80x80'].size === 0) {
                console.log('creating 80x80 image: ' + image.name());
                var readStream = image.createReadStream('original');
                var writeStream = image.createWriteStream('80x80');
                gm(readStream, image.name()).resize(80, 80).stream().pipe(writeStream);
            }
        });
    },
    down: function() {
    }
});

Migrations.add({
    version: 3,
    name: 'Add a slug to the existing Partups',
    up: function() {
        var partups = Partups.find({slug: {$exists: false}});

        partups.forEach(function(partup) {
            var slug = Partup.server.services.slugify.slugifyDocument(partup, 'name');
            Partups.update({_id:partup._id}, {$set: {slug: slug}});
        });
    },
    down: function() {
        Partups.update({slug: {$exists: true}}, {$unset: {slug: ''}}, {multi: true});
    }
});

Migrations.add({
    version: 4,
    name: 'Add a slug to the existing Networks',
    up: function() {
        var networks = Networks.find({slug: {$exists: false}});

        networks.forEach(function(network) {
            var slug = Partup.server.services.slugify.slugify(network.name);
            Networks.update({_id:network._id}, {$set: {slug: slug}});
        });
    },
    down: function() {
        Networks.update({slug: {$exists: true}}, {$unset: {slug: ''}}, {multi: true});
    }
});

Migrations.add({
    version: 5,
    name: 'Rename the user.profile.<social> fields to user.profile.<social>_url and prefix their values with i.e. https://facebook.com/. Also delete all linkedin_id fields.',
    up: function() {
        Meteor.users.find().forEach(function(user) {
            if (!user || !user.profile) return;

            if (user.profile.facebook) {
                user.profile.facebook_url = 'https://facebook.com/' + user.profile.facebook;
            }

            if (user.profile.instagram) {
                user.profile.instagram_url = 'https://instagram.com/' + user.profile.instagram;
            }

            if (user.profile.twitter) {
                user.profile.twitter_url = 'https://twitter.com/' + user.profile.twitter;
            }

            if (user.profile.linkedin) {
                user.profile.linkedin_url = 'https://linkedin.com/in/' + user.profile.linkedin;
            }

            if (user.profile.linkedin_id) {
                delete user.profile.linkedin_id;
            }

            Meteor.users.update({_id: user._id}, {$set: {'profile': user.profile}});
        });
    },
    down: function() {
        Meteor.users.find().forEach(function(user) {
            if (!user || !user.profile) return;

            if (user.profile.facebook_url) {
                delete user.profile.facebook_url;
            }

            if (user.profile.instagram_url) {
                delete user.profile.instagram_url;
            }

            if (user.profile.twitter_url) {
                delete user.profile.twitter_url;
            }

            if (user.profile.linkedin_url) {
                delete user.profile.linkedin_url;
            }

            Meteor.users.update({_id: user._id}, {$set: {'profile': user.profile}});
        });
    }
});

Migrations.migrateTo(5);
