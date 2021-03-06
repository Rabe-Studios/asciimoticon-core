const service = require('../helper/text.component');

const witchText = {
    a: 'Λ',
    b: 'ß',
    c: '¢',
    d: 'Ð',
    e: 'Σ',
    f: 'Ŧ',
    g: 'G',
    h: 'H',
    i: '|',
    j: '⅃',
    k: 'Ҡ',
    l: 'L',
    m: 'M',
    n: 'И',
    o: 'Ө',
    p: 'þ',
    q: 'Q',
    r: 'Я',
    s: '$',
    t: '†',
    u: 'V',
    v: 'V',
    w: 'W',
    x: 'X',
    y: 'Ұ',
    z: 'Z',
};

exports.getAscii = (text) => {
    return (!text) ? null : service.transpose(text.toLowerCase(), witchText);
};
