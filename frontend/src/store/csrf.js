//for extracting XSRF-TOKEN cookie value
import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
    //default method is GET
    options.method = options.method || 'GET';
    options.headers = options.headers || {};

    //auto set content-type
    //auto set XSRF-TOKEN for non-get requests
    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] =
          options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    const res = await window.fetch(url, options);

    if (res.status >= 400) throw res;
    else return res;
}

//call custom csrfFetch with /api/csrf/restore
export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}
