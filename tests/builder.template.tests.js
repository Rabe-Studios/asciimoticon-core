const expect = require('chai').expect;
const builder = require('../app').builder;

describe('template object functionality tests', () => {
    it('should be able to map items to keys', () => {
        const template = builder.template();
        template.map('key', 'value');
        const expected = {
            key: 'value'
        };
        const output = template.content;
        for (const key in output) {
            expect(output[key]).to.equal(expected[key]);
        }
        expect(Object.keys(output).length).to.equal(Object.keys(expected).length);
    });

    it('should be able to overwrite items if keys are the same', () => {
        const template = builder.template();
        template.map('key', 'value');
        template.map('key', 'value2');
        const expected = {
            key: 'value2'
        };
        const output = template.content;
        for (const key in output) {
            expect(output[key]).to.equal(expected[key]);
        }
        expect(Object.keys(output).length).to.equal(Object.keys(expected).length);
    });

    it('should be able to delete items with specified key', () => {
        const template = builder.template();
        template.map('key1', 'value1');
        template.map('key2', 'value2');
        template.delete('key1');
        const expected = {
            key2: 'value2'
        };
        const output = template.content;
        for (const key in output) {
            expect(output[key]).to.equal(expected[key]);
        }
        expect(Object.keys(output).length).to.equal(Object.keys(expected).length);
    });

    it('should throw an error if being passed null when deleting', () => {
        const template = builder.template();
        template.map('key1', 'value1');
        const output = template.delete;
        const input = null;
        const expected = 'Key is null';
        expect(output.bind(output, input)).to.throw(expected);
    });

    it('should throw an error if being passed null keys and null values', () => {
        const template = builder.template();
        const output = template.map;
        const input = null;
        const expected = 'Key and value parameters are null';
        expect(output.bind(output, input, input)).to.throw(expected);
    });

    it('should throw an error if being passed null keys', () => {
        const template = builder.template();
        const output = template.map;
        const input = null;
        const expected = 'Key is null';
        expect(output.bind(output, input, 'value')).to.throw(expected);
    });

    it('should throw an error if being passed null values', () => {
        const template = builder.template();
        const output = template.map;
        const input = null;
        const expected = 'Value is null';
        expect(output.bind(output, 'key', input)).to.throw(expected);
    });
});

describe('text template functionality tests', () => {
    const buildReverseTable = () => {
      const table = {};
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      for(let i = 0; i < alphabet.length; i++) {
          table[alphabet.charAt(i)] = alphabet.charAt(alphabet.length - i - 1);
      }
      return table;
    };

    const performValidityChecks = (textTemplate, keyword) => {
        expect(textTemplate.content).to.not.equal(null);
        expect(textTemplate.content[keyword]).to.not.equal(null);
        expect(typeof  textTemplate.content[keyword]).to.equal('function');
        expect(textTemplate.map).to.not.equal(null);
        expect(textTemplate.delete).to.not.equal(null);
        expect(textTemplate.merge).to.not.equal(null);
    };

    it('should be able to create a text template', () => {
        const table = buildReverseTable();
        const keyword = 'reverse';
        const textTemplate = builder.textTemplate(keyword, table);
        // validity checks
        performValidityChecks(textTemplate, keyword);
        // correct values
        const input = 'abc';
        const expected = 'zyx';
        const output = textTemplate.content[keyword](input);
        expect(output).to.equal(expected);
    });


    it('should be able to overwrite items if keys are the same', () => {
        const table = buildReverseTable();
        const keyword = 'reverse';
        const textTemplate = builder.textTemplate(keyword, table);
        // text template validity checks
        performValidityChecks(textTemplate, keyword);
        // check if overwriting
        textTemplate.map(keyword, 'value2');
        const expected = {
            reverse: 'value2'
        };
        const output = textTemplate.content;
        for (const key in output) {
            expect(output[key]).to.equal(expected[key]);
        }
        expect(Object.keys(output).length).to.equal(Object.keys(expected).length);
    });

    it('should be able to delete items with specified key', () => {
        const table = buildReverseTable();
        const keyword = 'reverse';
        const textTemplate = builder.textTemplate(keyword, table);
        performValidityChecks(textTemplate, keyword);
        textTemplate.map('key2', 'value2');
        textTemplate.delete(keyword);
        const expected = {
            key2: 'value2'
        };
        const output = textTemplate.content;
        for (const key in output) {
            expect(output[key]).to.equal(expected[key]);
        }
        expect(Object.keys(output).length).to.equal(Object.keys(expected).length);
    });

    it('should throw an error if being passed null when deleting', () => {
        const table = buildReverseTable();
        const keyword = 'reverse';
        const textTemplate = builder.textTemplate(keyword, table);
        performValidityChecks(textTemplate, keyword);
        const output = textTemplate.delete;
        const input = null;
        const expected = 'Key is null';
        expect(output.bind(output, input)).to.throw(expected);
    });

    it('should throw an error if being passed null keys and null values', () => {
        const table = buildReverseTable();
        const keyword = 'reverse';
        const textTemplate = builder.textTemplate(keyword, table);
        const output = textTemplate.map;
        const input = null;
        const expected = 'Key and value parameters are null';
        expect(output.bind(output, input, input)).to.throw(expected);
    });

    it('should throw an error if being passed null keys', () => {
        const table = buildReverseTable();
        const keyword = 'reverse';
        const textTemplate = builder.textTemplate(keyword, table);
        const output = textTemplate.map;
        const input = null;
        const expected = 'Key is null';
        expect(output.bind(output, input, 'value')).to.throw(expected);
    });

    it('should throw an error if being passed null values', () => {
        const table = buildReverseTable();
        const keyword = 'reverse';
        const textTemplate = builder.textTemplate(keyword, table);
        const output = textTemplate.map;
        const input = null;
        const expected = 'Value is null';
        expect(output.bind(output, 'key', input)).to.throw(expected);
    });
});

describe('template merge logic tests', () => {

    const checkContentUnchanged = (oldContent, newContent) => {
        expect(oldContent).to.not.equal(null);
        expect(newContent).to.not.equal(null);
        expect(Object.keys(newContent).length).to.equal(Object.keys(oldContent).length);
        Object.keys(oldContent).forEach(key => {
           expect(oldContent[key]).to.equal(newContent[key]);
        });
    };

    const checkIfTemplate = (object) => {
        expect(object.content).to.not.equal(null);
        expect(object.map).to.not.equal(null);
        expect(typeof object.map).to.equal('function');
        expect(object.delete).to.not.equal(null);
        expect(typeof object.delete).to.equal('function');
        expect(object.merge).to.not.equal(null);
        expect(typeof object.merge).to.equal('function');
    };

   it('should allow two templates to combine content', () => {
      const template1 = builder.template(); // {a: 1}
      const template2 = builder.template(); // {b: 2}
      template1.map('a', '1');
      template2.map('b', '2');
      const expected = {a: '1', b: '2'};
      const output = template1.merge([template2]);
      // check templates unchanged
       checkContentUnchanged({a: '1'}, template1.content);
       checkContentUnchanged({b: '2'}, template2.content);
       // check if output created a new template
       checkIfTemplate(output);
       Object.keys(expected).forEach(key => {
           expect(output.content[key]).equal(expected[key]);
       });
   });
});

describe('template to parser tests', () => {
    it('should allow custom templates to be passed', () => {
        const template = builder.template();
        template.map('custom', '(o____O)');
        const input = '(custom)';
        const expected = '(o____O)';
        const output = builder.parse(input, null, template);
        expect(output).to.equal(expected);
    });

    it('should allow templates to overwrite core keys', () => {
        const template = builder.template();
        template.map('bear', '(o____O)');
        const input = '(bear)';
        const expected = '(o____O)';
        const output = builder.parse(input, null, template);
        expect(output).to.equal(expected);
    });

    it('should allow templates to be functions', () => {
        const template = builder.template();
        template.map('customtext', (text) => {
            return '(o____O)';
        });
        const input = '(customtext,something here)';
        const expected = '(o____O)';
        const output = builder.parse(input, null, template);
        expect(output).to.equal(expected);
    });

    it('should not allow templates that does not have a .content mapping', () => {
        const template = {};
        const input = '(bear)';
        const output = builder.parse;
        const expected = 'Template needs to be the object returned by builder.template()';
        expect(output.bind(output, input, null, template)).to.throw(expected);
    });

    it('should use the core mapping when content is an empty object', () => {
        const template = {
            content: {}
        };
        const input = '(bear)';
        const output = builder.parse(input, null, template);
        const expected = 'ʕ·͡ᴥ·ʔ﻿';
        expect(output).to.equal(expected);
    });

    it('should allow custom template objects as long as it has the content property', () => {
        const template = {
            content: {
                custom: '(o____O)'
            }
        };
        const input = '(custom)';
        const output = builder.parse(input, null, template);
        const expected = '(o____O)';
        expect(output).to.equal(expected);
    });
});

describe('sequence builder templating tests', () => {
    it('should allow customers to build an asciimoticon using the builder', () => {
        const template = builder.template();
        template.map('eL', 'o');
        template.map('eR', 'o');
        template.map('fL', '(');
        template.map('fR', ')');
        template.map('m', '_');
        const sequence = ['fL', 'eL', 'm', 'eR', 'fR'];
        const expected = '(o_o)';
        const output = builder.build(sequence, template);
        expect(output).to.equal(expected);
    });

    it('should return a blank string if sequence and template is null', () => {
        const template = null;
        const sequence = null;
        const expected = '';
        const output = builder.build(sequence, template);
        expect(output).to.equal(expected);
    });

    it('should return a blank string if sequence is null', () => {
        const template = builder.template();
        template.map('eL', 'o');
        template.map('eR', 'o');
        template.map('fL', '(');
        template.map('fR', ')');
        template.map('m', '_');
        const sequence = null
        const expected = '';
        const output = builder.build(sequence, template);
        expect(output).to.equal(expected);
    });

    it('should return a blank string if template is null', () => {
        const template = null;
        const sequence = ['fL', 'eL', 'm', 'eR', 'fR'];
        const expected = '';
        const output = builder.build(sequence, template);
        expect(output).to.equal(expected);
    });

    it('should leave an undefined key inside the sequence as a blank string', () => {
        const template = builder.template();
        template.map('eL', 'o');
        template.map('eR', 'o');
        template.map('fL', '(');
        template.map('fR', ')');
        template.map('m', '_');
        const sequence = ['fL', 'e', 'm', 'eR', 'fR'];
        const expected = '(_o)';
        const output = builder.build(sequence, template);
        expect(output).to.equal(expected);
    });

    it('should throw an error if the template is not a builder.template() object', () => {
        const template = {};
        const sequence = ['fL', 'e', 'm', 'eR', 'fR'];
        const expected = 'Template needs to be the object returned by builder.template()';
        const output = builder.build;
        expect(output.bind(output, sequence, template)).to.throw(expected);
    });

    it('should return a blank string if no content is defined', () => {
        const template = {
            content: {}
        };
        const sequence = ['fL', 'e', 'm', 'eR', 'fR'];
        const expected = '';
        const output = builder.build(sequence, template);
        expect(output).to.equal(expected);
    });
});
