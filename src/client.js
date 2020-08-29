import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as sapper from '@sapper/app';

sapper.start({
    target: document.querySelector('#hydrate')
});
