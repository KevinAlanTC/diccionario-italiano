/* global api */
class ptes_Reverso {
    constructor(options) {
        this.options = options;
        this.maxexample = 2;
        this.word = '';
    }

    async displayName() {
        let locale = await api.locale();
        if (locale.indexOf('ES') != -1) return 'Portugués -> Español | Reverso';
        return 'Português -> Espanhol | Reverso';
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

        // Primero busquemos en Reverso para las traducciones
        let base = 'https://context.reverso.net/traduccion/portugues-espanol/';
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

        // Ahora busquemos en Linguee para el audio y IPA
        let lingueeUrl = `https://www.linguee.pt/portugues-espanhol/search?source=portugues&query=${encodeURIComponent(word)}`;
        let lingueeDoc = '';
        let audios = [];
        let reading = '';
        
        try {
            let lingueeData = await api.fetch(lingueeUrl);
            let lingueeParser = new DOMParser();
            lingueeDoc = lingueeParser.parseFromString(lingueeData, 'text/html');
            
            // Obtener audio
            let audioElement = lingueeDoc.querySelector('.audio');
            if (audioElement) {
                let audioUrl = audioElement.getAttribute('onclick');
                if (audioUrl) {
                    let mp3Match = audioUrl.match(/['"]([^'"]+\.mp3)['"]/);
                    if (mp3Match) {
                        audios.push('https://www.linguee.pt' + mp3Match[1]);
                    }
                }
            }

            // Obtener IPA
            let ipaElement = lingueeDoc.querySelector('.spelling');
            if (ipaElement) {
                reading = ipaElement.textContent.trim();
            }
        } catch (err) {
            console.log('Error getting Linguee data:', err);
        }

        let definitions = [];
        let examples = doc.querySelectorAll('.example');

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
                let pt_text = T(example.querySelector('.src'));
                let spa_text = T(example.querySelector('.trg'));
                let examp_concat = pt_text + ' - ' + '<span style="color:blue;">' + spa_text + '</span>';
                definition += `<li class='sent'><span class='pt_sent'>${examp_concat}</span></li>`;
            }
            definition += '</ul>';
        }

        definition && definitions.push(definition);

        let css = this.renderCSS();
        notes.push({
            css,
            expression: word,
            reading,
            extrainfo: '',
            definitions,
            audios
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
                span.pt_sent {margin-right:5px;}
                .reading {font-family: "Lucida Sans Unicode","Arial Unicode MS"; color: #666;}
            </style>`;
        return css;
    }
}
