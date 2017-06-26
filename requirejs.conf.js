require.config({
  paths: {
    jquery: 'lib/jquery/jquery',
    hogan: 'lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd',
    hgn: 'lib/requirejs-hogan-plugin/hgn',
    text: 'lib/requirejs-text/text',
    jasmine: 'lib/jasmine/lib/jasmine-core/jasmine',
    'jasmine-html': 'lib/jasmine/lib/jasmine-core/jasmine-html',
    'jasmine-jquery': 'lib/jasmine-jquery/lib/jasmine-jquery',
    'event-emitter': 'lib/event-emitter/src/event-emitter',
    inherits: 'lib/inherits/inherits',
    blanket: 'lib/blanket/dist/qunit/blanket',
    'blanket-jasmine': 'lib/blanket/dist/jasmine/blanket_jasmine',
    debug: 'lib/debug/debug'
  },
  packages: [{
    name: "auth",
    location: "lib/auth/src",
    main: "auth"
  },{
    name: "livefyre-bootstrap",
    location: "lib/livefyre-bootstrap/src"
  },{
    name: "streamhub-ui",
    location: "src"
  },{
    name: "view",
    location: "lib/view/src",
    main: "view"
  }],
  shim: {
    jquery: {
        exports: '$'
    },
    jasmine: {
        exports: 'jasmine'
    },
    'jasmine-html': {
        deps: ['jasmine'],
        exports: 'jasmine'
    },
    'blanket-jasmine': {
        exports: 'blanket',
        deps: ['jasmine']
    },
    'jasmine-jquery': {
        deps: ['jquery']
    }
  }
});
