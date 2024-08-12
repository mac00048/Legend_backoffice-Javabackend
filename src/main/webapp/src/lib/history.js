import { createBrowserHistory } from 'history'

const history = createBrowserHistory();

history.listen((location, action) => {
    // go back to top on history change
    if (window) { 
        window.scrollTo(0, 0);
    }
});

export default history;
