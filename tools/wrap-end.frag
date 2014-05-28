        //The modules for your project will be inlined above
        //this snippet. Ask almond to synchronously require the
        //module value for 'main' here and return it as the
        //value to use for the public API for the built file.

        require.almond = true;

        if ( ! (root.Livefyre && root.Livefyre.require)) {
            Livefyre.require = require;
            Livefyre.define = define;
        }

        return require('streamhub-sdk');
    }

}(this));
