"use strict";

const path = require('path');

module.exports = Franz => {
    function open_in_browser(e) {
        window.open(this.href);
        e.stopPropagation();
        e.preventDefault();
    };

    function initialise() {
        // wait for document to load
        if (document.readyState !== 'complete') {
            window.setTimeout(initialise, 50);
            return;
        }
        // wait for xhr
        if (document.querySelector('.dashboard-pane .phui-property-list-text-content')) {
            window.setTimeout(initialise, 50);
            return;
        }

        // count links to diffs
        Franz.setBadge(document.querySelectorAll('.dashboard-pane a[href^="/D"]').length);

        // open links in browser, not franz
        document.querySelectorAll('a').forEach(function(el) {
            if (!el.href) return;

            // allow main-menu
            if (document.querySelector('.phabricator-main-menu').contains(el)) return;

            // allow auth
            if (el.href.startsWith('/auth')) return;

            el.addEventListener('click', open_in_browser);
        });
    };

    initialise();

    // auto-refresh
    window.setInterval(function() {
        document.location = document.location;
    }, 5 * 60 * 1000);

    Franz.injectCSS(path.join(__dirname, 'user-style.css'));
};
