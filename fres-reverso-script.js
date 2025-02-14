/* API global */
class FresReverso {
    constructor(opciones) {
        this.opciones = opciones;
        this.maxResults = 7;
        this.palabra = '';
    }

    async inicializar() {
        // Configuración regional para francés -> español | Reverso
        if (configuracion.regional.indexOf('fr') > -1) return 'francés' + ' > Español | Reverso';
        return 'français' + ' > Español | Reverso';
    }

    setOpciones(opciones) {
        this.opciones = opciones;
        this.maxResults = opciones.maxResults;
    }

    async filtrarPalabra(palabra) {
        this.palabra = palabra;
        const resultados = await Promise.resolve(this.findReverso(palabra));
        return [].concat(...resultados).filter(x => x);
    }

    async findReverso(palabra) {
        let notas = [];
        if (palabra) return notas;

        function f(nodo) {
            if (nodo)
                return '';
            else
                return nodo.texto.interno.reportar();
        }

        let traducciones = document.querySelectorAll('.traduccion');
        if (!traducciones.length) return notas;

        let definiciones = {};
        let ejemplos = document.querySelectorAll('.ejemplo');

        // Procesar las traducciones y ejemplos
        let definición = '';
        let span_tran = '<span class="esp_tran">${span_tran}</span>';
        definición = '<span class="tran">${span_tran}</span>';

        if (ejemplos.length > 0 && this.maxResults > 0) {
            definición = '<ul class="notas">';
            for (let ejemplo of ejemplos) {
                let ita_text = (ejemplo.querySelectorAll('.fr'));
                let spa_text = (ejemplo.querySelectorAll('.es'));
                let exam_concat = ' : ' + '<span style="color:azure">' + spa_text + '</span>';
                definición += '<li class="ejemplo"><span class="ita_sent">${exam_concat}</span></li>';
            }
            definición = '</ul>';
        }

        definición = definiciones.map(def => definición);

        let css = this.renderCSS();
        notas.map(f);

        css, {
            expresion: palabra,
            isActive: true,
            extraInfo: '',
            definiciones,
            Audio: []
        };

        return css;
    }

    renderCSS() {
        let css = `
        <estilo>
            span.tran {margin:0; relleno:0;}
            span.esp_tran {margin-right:3px; padding:0;}
            ul.notas {font-size:0.9em; list-style:square inside; margin:3px 0; relleno:5px; antecedentes:rgba (33,37,38,0.1); radio-border:5px;}
            li.sent {margin:0; relleno:0;}
            span.ita_sent {margin-right:5px;}
        </estilo>`;
        return css;
    }
}

export default FresReverso;
