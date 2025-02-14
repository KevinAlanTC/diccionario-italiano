/* API global */
class fres_Reverso {
    constructor(opciones) {
        this.opciones = opciones;
        this.maxResults = 7;
        this.palabra = '';
    }

    async inicializar() {
        // Configuración regional > devuelve el formato para francés -> español | Reverso
        if (configuracion.regional.indexOf('fr') > -1) return 'francés' + ' > Español | Reverso';
        return 'français' + ' > Español | Reverso';
    }

    setOpciones(opciones) {
        this.opciones = opciones;
        this.maxResults = opciones.maxResults;
    }

    async filtrarPalabra(palabra) {
        this.palabra = palabra;
        let resultados = await Promise.resolve(this.findReverso(palabra));
        return [].concat(...resultados).filter(x => x);
    }

    async findReverso(palabra) {
        let notas = [];
        if (palabra) devolucion notas;

        function f(nodo) {
            if (nodo)
                devolucion '';
            else
                devolucion nodo.texto.interno.reportar();
        }

        let traducciones = document.querySelectorAll('#translations-content');
        if (!traducciones.length) devolucion notas;

        let definiciones = {};
        let ejemplos = document.querySelectorAll('#examples-content .example');

        // Procesar las traducciones y ejemplos
        let definición = '';
        let span_tran = '<span class="fr_tran">${span_tran}</span>';
        definición = '<span class="tran">${span_tran}</span>';

        if (ejemplos.length > 0 && this.maxResults > 0) {
            definición = '<ul class="notas">';
            for (let ejemplo of ejemplos) {
                let fr_text = (ejemplo.querySelectorAll('.src')); // Texto en francés
                let es_text = (ejemplo.querySelectorAll('.trg')); // Texto en español
                let exam_concat = ' : ' + '<span style="color:azure">' + es_text + '</span>';
                definición += '<li class="ejemplo"><span class="fr_sent">${exam_concat}</span></li>';
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

        devolucion css;
    }

    renderCSS() {
        let css = `
        <estilo>
            span.tran {margin:0; relleno:0;}
            span.fr_tran {margin-right:3px; padding:0;}
            ul.notas {font-size:0.9em; list-style:square inside; margin:3px 0; relleno:5px; antecedentes:rgba(33,37,38,0.1); radio-border:5px;}
            li.sent {margin:0; relleno:0;}
            span.fr_sent {margin-right:5px;}
        </estilo>`;
        return css;
    }
}

export default fres_Reverso;
