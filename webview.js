"use strict";

const path = require('path');

module.exports = Franz => {
    function open_in_browser(e) {
        window.open(this.href);
        e.stopPropagation();
        e.preventDefault();
    };

    function count_revisions(header) {
        // find pane by name
        let pane;
        for (let div of document.querySelectorAll('.homepage-panel .phui-object-box .phui-object-box')) {
            let header_div = div.querySelector('span.phui-header-header');
            if (!header_div) continue;
            if (header_div.textContent !== header) continue;
            pane = div;
            break;
        }
        if (!pane) return;

        // count LIs unless empty
        return pane.querySelector('.phui-oi-empty') ?
            0 :
            pane.querySelectorAll('ul.phui-oi-list-view>li').length;
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

        // set badges
        Franz.setBadge(
            count_revisions('Must Review') + count_revisions('Ready to Review'),
            count_revisions('Waiting on Review'),
        );

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
