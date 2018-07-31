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

        // find reviews-by-oldest dashboard pane
        let pane;
        for (let div of document.querySelectorAll('div.dashboard-pane')) {
            let header = div.querySelector('span.phui-header-header');
            if (!header) continue;
            if (header.textContent !== 'reviews-by-oldest') continue;
            pane = div;
            break;
        }

        // count links to diffs
        let review_count = 0;
        let wait_count = 0;
        if (pane) {
            for (let ul of pane.querySelectorAll('ul.phui-oi-list-view')) {
                let header = ul.querySelector('h1');
                if (!header) continue;

                let count = 0;
                for (let ch of ul.children) {
                    if (ch.nodeName === 'LI') {
                        count += 1;
                    }
                }
                if (header.textContent === 'Waiting on Review') {
                    wait_count += count;
                } else {
                    review_count += count;
                }
            }
        }
        Franz.setBadge(review_count, wait_count);

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
