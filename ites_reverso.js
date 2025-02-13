/* global api */
class ites_Reverso {
    constructor(options) {
        this.options = options;
        this.maxexample = 2;
        this.word = '';
    }

    async displayName() {
        let locale = await api.locale();
        if (locale.indexOf('ES') != -1) return 'Italiano -> Español | Reverso';
        return 'Italiano -> Spagnolo | Reverso';
    }

    setOptions(options) {
        this.options = options;
        this.maxexample = options.maxexample;
    }

    async findTerm(word) {
        this.word = word;
        let results = await Promise.all([this.findReverso(word)]);
        return [].concat(...results).filter(x => x);
    }

    async findReverso(word) {
        let notes = [];
        if (!word) return notes;

        function T(node) {
            if (!node)
                return '';
            else
                return node.innerText.trim();
        }

        let base = 'https://context.reverso.net/traduccion/italiano-espanol/';
        let url = base + encodeURIComponent(word);
        let doc = '';
        try {
            let data = await api.fetch(url);
            let parser = new DOMParser();
            doc = parser.parseFromString(data, 'text/html');
        } catch (err) {
            return [];
        }

        let translations = doc.querySelectorAll('.translation');
        if (!translations.length) return notes;

        let definitions = [];
        let examples = doc.querySelectorAll('.example');

        // Procesar las traducciones y ejemplos
        let definition = '';
        let spa_tran = Array.from(translations)
            .slice(0, 3)
            .map(t => T(t))
            .join(', ');

        spa_tran = `<span class='spa_tran'>${spa_tran}</span>`;
        definition += `<span class='tran'>${spa_tran}</span>`;

        if (examples.length > 0 && this.maxexample > 0) {
            definition += '<ul class="sents">';
            for (let i = 0; i < Math.min(this.maxexample, examples.length); i++) {
                let example = examples[i];
                let ita_text = T(example.querySelector('.src'));
                let spa_text = T(example.querySelector('.trg'));
                let examp_concat = ita_text + ' - ' + '<span style="color:blue;">' + spa_text + '</span>';
                definition += `<li class='sent'><span class='ita_sent'>${examp_concat}</span></li>`;
            }
            definition += '</ul>';
        }

        definition && definitions.push(definition);

        let css = this.renderCSS();
        notes.push({
            css,
            expression: word,
            reading: '',
            extrainfo: '',
            definitions,
            audios: []
        });

        return notes;
    }

    renderCSS() {
        let css = `
            <style>
                span.tran {margin:0; padding:0;}
                span.spa_tran {margin-right:3px; padding:0;}
                ul.sents {font-size:0.8em; list-style:square inside; margin:3px 0;padding:5px;background:rgba(13,71,161,0.1); border-radius:5px;}
                li.sent {margin:0; padding:0;}
                span.ita_sent {margin-right:5px;}
            </style>`;
        return css;
    }
}
