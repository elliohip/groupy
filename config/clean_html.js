const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');

const window = new JSDOM('').window;

module.exports = createDOMPurify(window).sanitize;